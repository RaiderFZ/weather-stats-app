<template>
  <div class="controls">
    <div class="flex items-center mb-4">
      <label for="chartType" class="mr-2">Chart Type:</label>
      <select
        id="chartType"
        v-model="selectedChartType"
        @change="store.updateChartType(selectedChartType as 'line' | 'bar' | 'pie')"
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
          class="border p-2"
          @change="filterData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChartStore } from '../stores/chartData';

const store = useChartStore();
const selectedChartType = ref(store.chartType);
const startDate = ref<string>('');
const endDate = ref<string>('');

function filterData() {
  store.filterByDateRange(startDate.value, endDate.value);
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
}
</style>