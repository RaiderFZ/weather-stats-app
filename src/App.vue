<template>
  <div :class="['min-h-screen p-6 text-gray-800 transition-all', backgroundClass] ">
      <h1 class="text-4xl font-bold text-center text-white drop-shadow-lg">
        🌦 Weather Stats Dashboard
      </h1>
      <CityInput />
      <ChartControls />
      <LineChart />
      <WeatherCard />
  </div>
</template>

<script setup lang="ts">
import CityInput from './components/CityInput.vue';
import WeatherCard from './components/WeatherCard.vue';
import ChartControls from './components/ChartControls.vue';
import LineChart from './components/LineChart.vue';
import { useBackgroundStyle } from './composables/useBackgroundStyle';

const { backgroundClass } = useBackgroundStyle();
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