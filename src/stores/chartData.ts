import { defineStore } from 'pinia';
import { ref } from 'vue';

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
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [10, 12, 15, 14, 18, 20],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    })

    const chartType = ref<'line' | 'bar' | 'pie'>('line');

    function updateChartType(type: 'line' | 'bar' | 'pie') {
        chartType.value = type;
    }

    return { chartData, chartType, updateChartType };
})