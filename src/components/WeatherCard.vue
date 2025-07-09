<template>
  <transition name="fade-slide" mode="out-in">
    <div
      v-if="store.currentWeather"
      key="weather-card"
      class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center animate-fade-in"
    >
      <div class="flex items-center space-x-4">
        <div class="text-6xl">🌤</div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ store.currentWeather.city }}</h2>
          <p class="text-gray-600 capitalize">{{ store.currentWeather.description }}</p>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 text-right">
        <p class="text-5xl font-bold text-blue-700">{{ store.currentWeather.temp }}°C</p>
        <p class="text-sm text-gray-700">💧 Humidity: {{ store.currentWeather.humidity }}%</p>
        <p class="text-sm text-gray-700">🧭 Pressure: {{ store.currentWeather.pressure }} hPa</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useChartStore } from '../stores/chartStore';

const store = useChartStore();
</script>

<style scoped>
@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-slide-up 0.5s ease-out;
}
</style>