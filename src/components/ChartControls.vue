<template>
  <div class="chart-controls">
    <div class="control-group">
      <div class="form-field">
        <label for="chartType">Chart Type</label>
        <select
          id="chartType"
          v-model="selectedChartType"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div class="form-field">
        <label for="dataType">Data Type</label>
        <select
          id="dataType"
          v-model="selectedDataType"
        >
          <option value="temperature">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="pressure">Pressure</option>
        </select>
      </div>
    </div>

    <div class="control-group">
      <div class="form-field">
        <label for="startDate">Start Date</label>
        <input
          id="startDate"
          type="date"
          v-model="startDate"
          :max="maxDate"
          @change="filterData"
        />
      </div>
      <div class="form-field">
        <label for="endDate">End Date</label>
        <input
          id="endDate"
          type="date"
          v-model="endDate"
          :max="maxDate"
          @change="filterData"
        />
      </div>
    </div>

    <div class="button-group">
      <button
        @click="exportChart"
        class="btn btn-green"
      >
        Export Chart as PNG
      </button>
      <button
        @click="resetDates"
        class="btn btn-gray"
      >
        Reset Dates
      </button>
      <button
        @click="clearLocalStorage"
        class="btn btn-red"
      >
        Clear Saved Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useChartInstance } from '../composables/useChartInstance';
import { useDateFilter } from '../composables/useDateFilter';
import { useLocalStorage } from '../composables/useLocalStorage';

const store = useChartStore();
const { startDate, endDate, maxDate, filterData, resetDates } = useDateFilter();
const { removeItem } = useLocalStorage();
const { chartInstance } = useChartInstance();

const selectedChartType = computed({
  get: () => store.chartType,
  set: (val) => store.updateChartType(val),
});

const selectedDataType = computed({
  get: () => store.dataType,
  set: (val) => {
    store.dataType = val;
    store.updateChartData(store.rawForecasts, store.currentCity || 'Unknown');
  }
});

const exportChart = () => {
  const hasData = store.chartData.datasets[0]?.data?.length > 0;
  if (chartInstance.value && hasData) {
    const link = document.createElement('a');
    link.href = chartInstance.value.toBase64Image();
    link.download = `weather-chart-${new Date().toISOString()}.png`;
    link.click();
  } else {
    alert('No chart available to export');
  }
};

const clearLocalStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('weatherCurrent') || key.startsWith('weather')) {
      localStorage.removeItem(key);
    }
    });

    store.chartData = { labels: [], datasets: [] };
    store.rawForecasts = [];
    store.error = null;
    alert('Saved data cleared');
  };
</script>

<style scoped>
.chart-controls {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.form-field {
  flex: 1 1 240px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  color: #374151;
}

select,
input[type="date"] {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  color: #1f2937;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
}

.btn-green {
  background-color: #16a34a;
}

.btn-green:hover {
  background-color: #15803d;
}

.btn-gray {
  background-color: #6b7280;
}

.btn-gray:hover {
  background-color: #4b5563;
}

.btn-red {
  background-color: #dc2626;
}

.btn-red:hover {
  background-color: #b91c1c;
}
</style>