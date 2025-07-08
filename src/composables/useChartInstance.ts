import { ref } from 'vue';
import { Chart } from 'chart.js';

const chartInstance = ref<Chart | null>(null);

export const useChartInstance = () => chartInstance;