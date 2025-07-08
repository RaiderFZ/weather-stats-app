<template>
  <div class="container">
    <h1 class="title">Weather Stats Dashboard</h1>
    <div class="controls">
      <label class="mr-2" for="chartType">Chart type:</label>

      <select  
        id="chartType"
        v-model="selectedChartType"
        @change="updateChartType"
        class="border p-2">
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
      </select>
    </div>
    <LineChart/>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

import LineChart from './components/LineChart.vue';
import { useChartStore } from './stores/chartData';

const store = useChartStore();
const selectedChartType = ref(store.chartType);

function updateChartType() {
  store.updateChartType(selectedChartType.value as 'line' | 'bar' | 'pie');
}
</script>

<style scoped>
  .container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
}
.controls {
  margin-bottom: 16px;
}
</style>