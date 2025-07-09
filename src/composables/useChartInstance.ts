import { ref } from 'vue';
import { Chart } from 'chart.js';

const chartInstance = ref<Chart | null>(null);

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
};

export const useChartInstance = () => ({
  chartInstance, 
  destroyChart,
});
