import { computed } from 'vue';
import { useChartStore } from '../stores/chartStore';

export function useBackgroundStyle() {
  const store = useChartStore();

  const weatherToClass: Record<string, string> = {
    clear: 'bg-clear',
    clouds: 'bg-clouds',
    rain: 'bg-rain',
    snow: 'bg-snow',
    thunderstorm: 'bg-thunderstorm',
    mist: 'bg-mist',
  };

  const backgroundClass = computed(() => {
    const desc = store.currentWeather?.description?.toLowerCase() ?? '';
    const key = Object.keys(weatherToClass).find(k => desc.includes(k));
    return weatherToClass[key ?? 'clear'];
  });

  return { backgroundClass };
}
