<template>
  <div class="container">
    <h1 class="title">Weather Stats Dashboard</h1>
    <LineChart/>
  </div>
</template>

<script setup lang="ts">
import LineChart from './components/LineChart.vue';
</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 16px;
  }
  .title{
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

</style>