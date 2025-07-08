<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useChartStore } from '../stores/chartData';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const store = useChartStore();
let chartInstance: Chart | null = null;

const createOrUpdateChart = () => {
  if (chartCanvas.value) {
    if(chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(chartCanvas.value, {
        type: store.chartType,
        data: store.chartData,
        options: {
            responsive: true,
            scales: store.chartType === 'pie' ? {} : {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
  }
};

onMounted(() => {
    createOrUpdateChart()
});

watch(
  () => [store.chartData, store.chartType],
  () => {
    createOrUpdateChart();
  },
  { deep: true }
);
</script>