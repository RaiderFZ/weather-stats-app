import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

interface WeatherForecast {
  dt: number;
  main: { temp: number };
}

export const useChartStore = defineStore('chart', () => {
  const chartData = ref<ChartData>({ labels: [], datasets: [] });
  const chartType = ref<'line' | 'bar' | 'pie'>('line');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const rawForecasts = ref<WeatherForecast[]>([]);
  const currentCity = ref('');

  const getNextDaysForecasts = (days: number): WeatherForecast[] => {
    const result: WeatherForecast[] = [];
    const seenDates = new Set<string>();

    for (const f of rawForecasts.value) {
        const date = new Date(f.dt * 1000).toISOString().split('T')[0];
        seenDates.add(date);
        if (seenDates.size > days) break;
        result.push(f);
    }

    return result;
    };

  const fetchWeatherData = async (city: string, abortController: AbortController) => {
    isLoading.value = true;
    error.value = null;
    currentCity.value = city;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`,
        { signal: abortController.signal }
      );

      rawForecasts.value = response.data.list; 
      
      updateChartData(getNextDaysForecasts(5), city);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        error.value = 'Failed to fetch weather data. Please check the city name.';
      }
    } finally {
      isLoading.value = false;
    }
  };

  const updateChartType = (type: 'line' | 'bar' | 'pie') => {
    chartType.value = type;
  };

  const updateChartData = (forecasts: WeatherForecast[], city: string) => {
    const dailyData: { [key: string]: number[] } = {};
    forecasts.forEach(f => {
        const date = new Date(f.dt * 1000).toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = [];
        dailyData[date].push(f.main.temp);
    });

    const labels = Object.keys(dailyData).sort();
    const data = labels.map(date => {
        const temps = dailyData[date];
        return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
    });

    chartData.value = {
        labels,
        datasets: [
        {
            label: `Temperature in ${city} (°C)`,
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        },
        ],
    };
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

  return { 
    chartData, 
    chartType, 
    isLoading, 
    error, 
    fetchWeatherData, 
    updateChartType, 
    filterByDateRange, 
    currentCity 
};
});