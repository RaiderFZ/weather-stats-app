import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { buildChartData } from './chartBuilder';
import type { DataType, ChartData, WeatherForecast, CurrentWeather, ChartType } from '../types/weather';

export const useChartStore = defineStore('chart', () => {
  const chartData = ref<ChartData>({ labels: [], datasets: [] });
  const chartType = ref<ChartType>('line');
  const dataType = ref<DataType>('temperature');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const rawForecasts = ref<WeatherForecast[]>([]);
  const currentCity = ref('');
  const currentWeather = ref<CurrentWeather | null>(null);

  const getNextDaysForecasts = (days: number): WeatherForecast[] => {
    const grouped: Record<string, WeatherForecast[]> = {};
  const result: WeatherForecast[] = [];

  for (const f of rawForecasts.value) {
    const date = new Date(f.dt * 1000).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(f);
  }

  const dates = Object.keys(grouped).sort().slice(0, days);
  dates.forEach(date => {
    result.push(...grouped[date]); // ✅ Добавляем ВСЕ прогнозы дня
  });

  return result;
  };

  const fetchWeatherData = async (city: string, abortController: AbortController) => {
    if (!city.trim()) {
        error.value = 'City name cannot be empty';
        return;
    }
    isLoading.value = true;
    error.value = null;
    currentCity.value = city;

    try {
        const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`,
        { signal: abortController.signal }
    );

    rawForecasts.value = response.data.list;
    await new Promise(resolve => setTimeout(resolve, 500));
    updateChartData(getNextDaysForecasts(5), city);
    } catch (err: unknown) {
            if (axios.isCancel(err)) {
                console.log('Request was cancelled');
            } else {
                error.value = 'Failed to fetch weather data. Please check the city name.';
            }
    } finally {
            isLoading.value = false;
    }
    };

    const updateChartType = (type: ChartType) => {
        chartType.value = type;
    };

    const updateChartData = (forecasts: WeatherForecast[], city: string) => {
        chartData.value = buildChartData(forecasts, city, dataType.value);
  };

  const filterByDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      error.value = null;
      updateChartData(getNextDaysForecasts(5), currentCity.value || 'Unknown');
      return;
    }

    const start = new Date(startDate).setUTCHours(0, 0, 0, 0) / 1000;
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999) / 1000;

    const filteredForecasts = rawForecasts.value.filter(
      (f) => f.dt >= start && f.dt <= end
    );

    if (filteredForecasts.length === 0) {
      error.value = 'No data available for the selected date range';
      return;
    }

    error.value = null;
    updateChartData(
      filteredForecasts,
      chartData.value.datasets[0]?.label?.split(' in ')[1] || 'Unknown'
    );
  };

    const fetchCurrentWeather = async (city: string) => {
      try {
        const key = `weatherCurrent-${city.toLowerCase()}`;
        const timeKey = `weatherCurrentTime-${city.toLowerCase()}`;
        const cached = localStorage.getItem(key);
        const cachedTime = localStorage.getItem(timeKey);
        const now = Date.now();

        if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
          currentWeather.value = JSON.parse(cached) as CurrentWeather;
          return;
        }

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`
        );

        const weather = response.data;
        const parsed: CurrentWeather = {
          temp: weather.main.temp,
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          description: weather.weather[0]?.description ?? 'No data',
          city: weather.name,
        };

        currentWeather.value = parsed;
        localStorage.setItem(key, JSON.stringify(parsed));
        localStorage.setItem(timeKey, now.toString());
      } catch (err) {
        console.error('Failed to fetch current weather', err);
      }
    };

  return {
    chartData,
    chartType,
    dataType,
    isLoading,
    error,
    fetchWeatherData,
    updateChartType,
    filterByDateRange,
    updateChartData,
    rawForecasts,
    currentCity,
    currentWeather,
    fetchCurrentWeather,
  };
});