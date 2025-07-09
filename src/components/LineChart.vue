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
import type { CustomDataset } from '../types/weather';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const store = useChartStore();
const { chartInstance, destroyChart } = useChartInstance();

const createOrUpdateChart = () => {
  const dataset = store.chartData.datasets[0];

  // 🛡 Защита: нет данных или canvas
  if (!chartCanvas.value || !dataset?.data || dataset.data.length === 0) {
    return;
  }

  // 🎯 Фильтруем только числовые значения
  const numericData = dataset.data.filter((v): v is number => typeof v === 'number');
  if (numericData.length === 0) return;

  // 🧹 Уничтожаем предыдущий график
  if (chartInstance.value) {
    destroyChart();
  }

  // 📊 Создаём новый график
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

// 🪄 Обновляем график при изменении данных или типа
watch(
  [() => store.chartData, () => store.chartType],
  () => {
    createOrUpdateChart();
  },
  { deep: true }
);

// 🚀 Создаём график после монтирования, но только если есть данные
onMounted(() => {
  createOrUpdateChart();
});
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
    max-height: 300px;
  }
}
</style>
