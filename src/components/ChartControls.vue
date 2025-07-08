<template>
  <div class="controls">
    <div class="flex items-center mb-4">
      <label for="chartType" class="mr-2">Chart Type:</label>
      <select
        id="chartType"
        v-model="selectedChartType"
        class="border p-2"
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
      </select>
    </div>
    <div class="flex items-center space-x-4">
      <div>
        <label for="startDate" class="mr-2">Start Date:</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          :max="maxDate"
          class="border p-2"
          @change="filterData"
        />
      </div>
      <div>
        <label for="endDate" class="mr-2">End Date:</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
          :max="maxDate"
          class="border p-2"
          @change="filterData"
        />
      </div>
    </div>

    <button
      @click="exportChart"
      class="p-2 bg-green-500 text-white hover:bg-green-600"
    >
     Export Chart as PNG 
    </button>

    <button
      @click="resetDates"
      class="p-2 bg-gray-400 text-white hover:bg-gray-500"
    >
      Reset Dates
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChartStore } from '../stores/chartData';
import { useChartInstance } from '../composables/useChartInstance';

const store = useChartStore();

const selectedChartType = computed({
  get: () => store.chartType,
  set: (val) => store.updateChartType(val),
});

const startDate = ref<string>('');
const endDate = ref<string>('');

const maxDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString().split('T')[0];
});

const resetDates = () => {
  startDate.value = '';
  endDate.value = '';
  store.filterByDateRange('', '');
};

const filterData = () => {
  if (new Date(endDate.value) < new Date(startDate.value)) {
    alert('End date must be after start date');
    return;
  }
  
  store.filterByDateRange(startDate.value, endDate.value);
};

const exportChart = () => {
  const chartInstance = useChartInstance();
  const hasData = store.chartData.datasets[0]?.data?.length > 0;

  if (chartInstance.value && hasData) {
    const link = document.createElement('a');
    link.href = chartInstance.value.toBase64Image();
    link.download = `weather-chart-${new Date().toISOString()}.png`;
    link.click();
  } else {
    alert('No chart available to export');
  }
};
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
}
</style>