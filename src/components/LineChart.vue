<template>
    <div>
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if(chartCanvas.value) {
        new Chart(chartCanvas.value, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: [10, 12, 15, 14, 18, 20],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
});
</script>