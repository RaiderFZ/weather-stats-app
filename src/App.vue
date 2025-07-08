<template>
  <div class="container">
    <h1 class="title">Weather Stats Dashboard</h1>
    <div class="controls">
      <label for="city" class="mr-2">
        City:
      </label>
      <input 
        id="city"
        type="text"
        v-model="city"
        placeholder="Enter city"
        class="border p-2 mr-2">
      <button 
        @click="fetchData"
        :disabled="store.isLoading"
        class="p-2 bg-blue-500 text-white"
      >
        {{ store.isLoading ? 'Loading...' : 'Fetch Weather' }}
      </button>
      <div v-if="store.isLoading" class="spinner"></div>
      <p v-if="store.error" class="text-red-500 mt-2">
        {{ store.error }}
      </p>
    </div>
    <ChartControls />
    <LineChart/>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import LineChart from './components/LineChart.vue';
import ChartControls from './components/ChartControls.vue';
import { useChartStore } from './stores/chartData';

const store = useChartStore();
const city = ref('London');
let abortController: AbortController | null = null;

const fetchData = async () => {
  if(abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  await store.fetchWeatherData(city.value, abortController);
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
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>