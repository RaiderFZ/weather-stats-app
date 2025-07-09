<template>
  <div class="city-input">
    <div class="form-group">
      <label for="city" class="label">City:</label>
      <input
        id="city"
        type="text"
        v-model="localCity"
        placeholder="Enter city"
        class="input"
      />
      <button
        @click="fetchData"
        :disabled="store.isLoading"
        class="button"
      >
        {{ store.isLoading ? 'Loading...' : 'Fetch Weather' }}
      </button>
      <div v-if="store.isLoading" class="spinner"></div>
    </div>
    <p v-if="store.error" class="error-text">{{ store.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useLocalStorage } from '../composables/useLocalStorage';

const store = useChartStore();
const { getItem, setItem } = useLocalStorage();
const localCity = ref(getItem('weatherCity', ''));

let abortController: AbortController | null = null;

const fetchData = async () => {
  if (!localCity.value.trim()) return;

  if (abortController) abortController.abort();
  abortController = new AbortController();

  store.currentCity = localCity.value;

  await Promise.all([
    store.fetchWeatherData(localCity.value, abortController),
    store.fetchCurrentWeather(localCity.value),
  ]);

  setItem('weatherCity', localCity.value);
};
</script>

<style scoped>
.city-input {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.label {
  font-weight: 600;
  color: #374151;
}

.input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  min-width: 200px;
}

.button {
  padding: 10px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  background-color: #1e40af;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-text {
  color: #dc2626;
  margin-top: 10px;
  font-size: 14px;
}
</style>
