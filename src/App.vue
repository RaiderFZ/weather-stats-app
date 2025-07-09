<template>
  <div :class="['app-wrapper', backgroundClass]">
    <div class="container">
      <h1 class="dashboard-title">
        🌦 Weather Stats Dashboard
      </h1>
      <CityInput />
      <ChartControls />
      <LineChart />
      <WeatherCard />
    </div>
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

<style>
.app-wrapper {
  min-height: 100vh;
  padding: 48px 24px;
  font-family: 'Inter', sans-serif;
  color: #1f2937;
  transition: background 0.5s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a; 
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

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

.bg-clear {
  background: linear-gradient(to bottom right, #fef08a, #60a5fa); /* yellow to blue */
}

.bg-clouds {
  background: linear-gradient(to bottom right, #d1d5db, #6b7280); /* light to dark gray */
}

.bg-rain {
  background: linear-gradient(to bottom right, #3b82f6, #4b5563); /* blue to gray */
}

.bg-snow {
  background: linear-gradient(to bottom right, #f9fafb, #dbeafe); /* white to light blue */
}

.bg-thunderstorm {
  background: linear-gradient(to bottom right, #6d28d9, #1f2937); /* purple to dark */
}

.bg-mist {
  background: linear-gradient(to bottom right, #e5e7eb, #9ca3af); /* light gray to medium */
}
</style>