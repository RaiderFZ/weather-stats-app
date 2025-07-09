import type { ChartData, WeatherForecast, DataType } from '../types/weather';
import { getColorFor, unitFor, capitalizeFirst, getColorPalette } from './chartUtils';

export function buildChartData(
  forecasts: WeatherForecast[],
  city: string,
  dataType: DataType
): ChartData {
  const dailyMap: Record<string, { values: number[], descriptions: string[] }> = {};

  forecasts.forEach(f => {
    const date = new Date(f.dt * 1000).toISOString().split('T')[0];

    const value = dataType === 'humidity'
      ? f.main.humidity
      : dataType === 'pressure'
      ? f.main.pressure
      : f.main.temp;

    if (!dailyMap[date]) {
      dailyMap[date] = { values: [], descriptions: [] };
    }

    dailyMap[date].values.push(value);
    dailyMap[date].descriptions.push(f.weather?.[0]?.description ?? '');
  });

  const labels = Object.keys(dailyMap).sort();
  const data: number[] = [];
  const tooltipDescriptions: string[] = [];

  labels.forEach(date => {
    const day = dailyMap[date];
    const avg = day.values.reduce((sum, v) => sum + v, 0) / day.values.length;
    const desc = getMostFrequent(day.descriptions);
    data.push(+avg.toFixed(2));
    tooltipDescriptions.push(desc);
  });

  return {
    labels,
    datasets: [
      {
        label: `${capitalizeFirst(dataType)} in ${city} ${unitFor(dataType)}`,
        data,
        backgroundColor: getColorPalette(data.length),
        borderColor: getColorFor(dataType),
        fill: false,
        descriptionTooltips: tooltipDescriptions,
      },
    ],
  };
}

function getMostFrequent(arr: string[]): string {
  const freq: Record<string, number> = {};
  for (const str of arr) {
    freq[str] = (freq[str] || 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
}
