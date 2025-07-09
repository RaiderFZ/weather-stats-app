<template>
  <div class="chart-container animate-fade-in">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useChartStore } from '../stores/chartStore';
import { useChartInstance } from '../composables/useChartInstance';
import type { CustomDataset } from '../types/weather';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const store = useChartStore();
const { chartInstance, destroyChart } = useChartInstance();

const createOrUpdateChart = () => {
  const dataset = store.chartData.datasets[0];

  if (!chartCanvas.value || !dataset?.data || dataset.data.length === 0) {
    return;
  }

  const numericData = dataset.data.filter((v): v is number => typeof v === 'number');
  if (numericData.length === 0) return;

  if (chartInstance.value) {
    destroyChart();
  }

  chartInstance.value = new Chart(chartCanvas.value, {
    type: store.chartType,
    data: store.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
      scales: store.chartType === 'pie' ? {} : {
        y: {
          beginAtZero: false,
          min: Math.min(...numericData) - 1,
          max: Math.max(...numericData) + 1,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            afterBody: (context) => {
              const index = context[0].dataIndex;
              const dataset = context[0].dataset as CustomDataset;
              const desc = dataset.descriptionTooltips?.[index];
              return desc ? `🌥 ${desc}` : '';
            },
          },
        },
      },
    },
  });
};

watch(
  [() => store.chartData, () => store.chartType],
  () => {
    createOrUpdateChart();
  },
  { deep: true }
);

onMounted(() => {
  createOrUpdateChart();
});
</script>

<style scoped>
.chart-container {
  max-width: 100%;
  height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-slide-up 0.6s ease-out;
}
</style>
