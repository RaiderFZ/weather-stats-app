<template>
  <transition name="fade-slide" mode="out-in">
    <div
      v-if="store.currentWeather"
      key="weather-card"
      class="weather-card animate-fade-in"
    >
      <div class="weather-main">
        <div class="weather-icon">🌤</div>
        <div>
          <h2 class="city-name">{{ store.currentWeather.city }}</h2>
          <p class="description">{{ store.currentWeather.description }}</p>
        </div>
      </div>
      <div class="weather-info">
        <p class="temp">{{ store.currentWeather.temp }}°C</p>
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
.weather-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-icon {
  font-size: 48px;
}

.city-name {
  font-size: 24px;
  font-weight: bold;
  color: #1e3a8a;
}

.description {
  text-transform: capitalize;
  color: #4b5563;
}

.weather-info {
  text-align: right;
}

.temp {
  font-size: 36px;
  font-weight: bold;
  color: #2563eb;
}
</style>