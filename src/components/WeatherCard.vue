<template>
  <transition name="fade-slide" mode="out-in">
    <div
      v-if="store.currentWeather"
      key="weather-card"
      class="weather-card"
    >
      <div class="weather-left">

          <img
            v-if="store.currentWeather.icon"
            :src="`https://openweathermap.org/img/wn/${store.currentWeather.icon}@2x.png`"
            alt="Weather Icon"
            class="weather-icon"
          />

        <div>
          <h2 class="city">{{ store.currentWeather.city }}</h2>
          <p class="description">{{ store.currentWeather.description }}</p>
        </div>
      </div>
      <div class="weather-right">
        <p class="temp">{{ store.currentWeather.temp.toFixed(2) }}°C</p>
        <p class="humidity">💧 Humidity: {{ store.currentWeather.humidity }}%</p>
        <p class="pressure">🌡 Pressure: {{ store.currentWeather.pressure }} hPa</p>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #f4f6f8, #ffffff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weather-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  width: 60px;
  height: 60px;
  background-color: #f3f4f6; 
  border: 2px solid #d1d5db;
  border-radius: 50%;
  padding: 6px;
}

.city {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
}

.description {
  text-transform: capitalize;
  color: #374151;
}

.weather-right {
  text-align: right;
}

.temp {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
}

.humidity,
.pressure {
  font-size: 0.9rem;
  color: #374151;
}


</style>
