<template>
  <div class="container">
    <h1 class="title">Weather Stats Dashboard</h1>
    <div class="controls">

      <label for="city" class="mr-2">
        City:
      </label>
      <input 
        type="text"
        v-model="city"
        placeholder="Enter city"
        class="border p-2 mr-2">

      <button 
        @click="fetchData"
        :disabled="store.isLoading"
        class="p-2 bg-blue-500 text-white"
      >
        {{ store.isLoading ? 'Loading...' : 'Fetch Weatcher' }}
      </button>
      <p v-if="store.error" class="text-red-500 mt-2">
        {{ store.error }}
      </p>
    </div>
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
const city = ref('London');
const selectedChartType = ref(store.chartType);
let abortedController: AbortController | null = null;

const fetchData = async () => {
  if(abortedController) {
    abortedController.abort();
  }
  abortedController = new AbortController();
  await store.fetchWeatherData(city.value, abortedController);
}

const updateChartType = () => {
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