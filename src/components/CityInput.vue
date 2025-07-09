<template>
  <div class="bg-white/80 backdrop-blur p-4 rounded-lg shadow space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
      <label for="city" class="text-gray-700 font-semibold">City:</label>
      <input
        id="city"
        type="text"
        v-model="localCity"
        placeholder="Enter city"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        @click="fetchData"
        :disabled="store.isLoading"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:opacity-50"
      >
        {{ store.isLoading ? 'Loading...' : 'Fetch Weather' }}
      </button>
      <div v-if="store.isLoading" class="spinner ml-2"></div>
    </div>
    <p v-if="store.error" class="text-red-600 text-sm">{{ store.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from 'lodash';
import { useChartStore } from '../stores/chartStore';
import { useLocalStorage } from '../composables/useLocalStorage';

const store = useChartStore();
const { getItem, setItem } = useLocalStorage();
const localCity = ref(getItem('weatherCity', 'London'));

let abortController: AbortController | null = null;

const fetchData = async () => {
    if (abortController) {
        abortController.abort();
    }
    abortController = new AbortController();
    await Promise.all([
        store.fetchWeatherData(localCity.value, abortController),
        store.fetchCurrentWeather(localCity.value),
    ]);
    setItem('weatherCity', localCity.value);
};

const fetchDataDebounced = debounce(async () => {
    if (abortController) {
        abortController.abort();
    }
    abortController = new AbortController();
    await Promise.all([
        store.fetchWeatherData(localCity.value, abortController),
        store.fetchCurrentWeather(localCity.value),
    ]);
    setItem('weatherCity', localCity.value);
}, 500);

watch(localCity, () => {
    if (localCity.value.trim()) {
        fetchDataDebounced();
        setItem('weatherCity', localCity.value);
    }
});
</script>

<style scoped>
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
