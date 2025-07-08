import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface ChartData {
    labels: string[];
    datasets: { 
        label: string; 
        data: number[]; 
        borderColor: string
        fill: boolean 
    }[];
};

export const useChartStore = defineStore('chart', () =>  {
    const chartData = ref<ChartData>({
        labels: [], 
        datasets: []
    });
    const chartType = ref<'line' | 'bar' | 'pie'>('line');
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchWeatherData = async (city: string, abortController: AbortController) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`,
                { signal: abortController.signal }
            );

            const forecasts = response.data.list.slice(0, 6);
            chartData.value = {
                labels: forecasts.map((f: any) => new Date(f.dt * 1000).toLocaleDateString()),
                datasets: [
                    {
                        label: `Temperature in ${city} (°C)`,
                        data: forecasts.map((f: any) => f.main.temp),
                        borderColor: 'rgba(75, 192, 192, 1)',fill: false,
                    },
                ],
            };
        } catch (err: any) {
            if(err.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                error.value = 'Failed to fetch weather data. Please check the city name.';
            }
        } finally {
            isLoading.value = false;
        }
    }

    const updateChartType = (type: 'line' | 'bar' | 'pie') => {
        chartType.value = type;
    }

    return { chartData, chartType, isLoading, error, fetchWeatherData, updateChartType };
})