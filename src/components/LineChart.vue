<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useChartStore } from '../stores/chartStore';
import { useChartInstance } from '../composables/useChartInstance';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const store = useChartStore();
let chartInstance = useChartInstance();

const createOrUpdateChart = () => {
  if (chartCanvas.value) {
    if(chartInstance.value) {
      chartInstance.value.destroy();
    }
    chartInstance.value = new Chart(chartCanvas.value, {
        type: store.chartType,
        data: store.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000, // Анимация появления графика (1 секунда)
              easing: 'easeInOutQuad',
            },
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
  () => store.chartData,
  () => {
    createOrUpdateChart();
  },
  { deep: true }
);

watch(
  () => store.chartType,
  () => {
    createOrUpdateChart();
  }
);
</script>

<style scoped>
.chart-container {
  opacity: 0;
  animation: fadeIn 1s ease-in-out forwards;
  max-height: 400px;
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .chart-container {
    max-height: 300px; /* Меньшая высота на мобильных */
  }
}
</style>