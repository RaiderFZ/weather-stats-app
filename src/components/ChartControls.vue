<template>
  <div class="controls flex flex-col space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <label for="chartType" class="mr-2">Chart Type:</label>
      <select
        id="chartType"
        v-model="selectedChartType"
        class="border p-2 w-full sm:w-auto"
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
      </select>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <label for="dataType" class="mr-2">Data Type:</label>
      <select
        id="dataType"
        v-model="selectedDataType"
        class="border p-2 w-full sm:w-auto"
      >
        <option value="temperature">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="pressure">Pressure</option>
      </select>
    </div>
    <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <div class="flex flex-col">
        <label for="startDate" class="mr-2">Start Date:</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          :max="maxDate"
          class="border p-2 w-full"
          @change="filterData"
        />
      </div>
      <div class="flex flex-col">
        <label for="endDate" class="mr-2">End Date:</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
          :max="maxDate"
          class="border p-2 w-full"
          @change="filterData"
        />
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <button
        @click="exportChart"
        class="p-2 bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
      >
        Export Chart as PNG
      </button>
      <button
        @click="resetDates"
        class="p-2 bg-gray-400 text-white hover:bg-gray-500 w-full sm:w-auto"
      >
        Reset Dates
      </button>
      <button
        @click="clearLocalStorage"
        class="p-2 bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto"
      >
        Clear Saved Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useChartInstance } from '../composables/useChartInstance';
import { useDateFilter } from '../composables/useDateFilter';
import { useLocalStorage } from '../composables/useLocalStorage';

const store = useChartStore();
const { startDate, endDate, maxDate, filterData, resetDates } = useDateFilter();
const { removeItem } = useLocalStorage();
const { chartInstance } = useChartInstance();


const selectedChartType = computed({
  get: () => store.chartType,
  set: (val) => store.updateChartType(val),
});

const selectedDataType = computed({
  get: () => store.dataType,
  set: (val) => {
  store.dataType = val;
  const city = store.currentCity || 'Unknown';
    store.updateChartData(store.rawForecasts, city);
  }
});

const exportChart = () => {
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

const clearLocalStorage = () => {
  removeItem('weatherCity');
  removeItem('weatherStartDate');
  removeItem('weatherEndDate');
  store.chartData = { labels: [], datasets: [] };
  store.rawForecasts = [];
  store.error = null;
  alert('Saved data cleared');
};
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
}
</style>