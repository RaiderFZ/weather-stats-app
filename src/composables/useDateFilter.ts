import { ref, computed } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useLocalStorage } from './useLocalStorage';

export const useDateFilter = () => {
  const store = useChartStore();
  const { getItem, setItem, removeItem } = useLocalStorage();

  const startDate = ref<string>(getItem('weatherStartDate', ''));
  const endDate = ref<string>(getItem('weatherEndDate', ''));

  const maxDate = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  });

  const validateDates = () => {
    if (!startDate.value || !endDate.value) return true;
    return new Date(endDate.value) >= new Date(startDate.value);
  };

  const filterData = () => {
    if (!validateDates()) {
      alert('End date must be after start date');
      return;
    }
    setItem('weatherStartDate', startDate.value);
    setItem('weatherEndDate', endDate.value);
    store.filterByDateRange(startDate.value, endDate.value);
  };

  const resetDates = () => {
    startDate.value = '';
    endDate.value = '';
    removeItem('weatherStartDate');
    removeItem('weatherEndDate');
    store.filterByDateRange('', '');
  };

  return { startDate, endDate, maxDate, filterData, resetDates };
};