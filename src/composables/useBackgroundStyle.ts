import { computed } from 'vue';
import { useChartStore } from '../stores/chartStore';

export const useBackgroundStyle = () => {
  const store = useChartStore();

  const backgroundClass = computed(() => {
    const temp = store.currentWeather?.temp ?? 15;
    if (temp >= 30) return 'bg-gradient-to-br from-orange-400 to-red-500';
    if (temp >= 20) return 'bg-gradient-to-br from-yellow-300 to-orange-400';
    if (temp >= 10) return 'bg-gradient-to-br from-blue-200 to-blue-400';
    return 'bg-gradient-to-br from-blue-900 to-blue-600';
  });

  return { backgroundClass };
};