import type { ChartData } from './chartStore';
import type { WeatherForecast } from './chartStore';
import { getColorFor, unitFor, capitalizeFirst } from './chartUtils';
import type {DataType} from './chartUtils';

export function buildChartData(
  forecasts: WeatherForecast[],
  city: string,
  dataType: DataType
): ChartData {
  const dailyData: Record<string, number[]> = {};

  forecasts.forEach(f => {
    const date = new Date(f.dt * 1000).toISOString().split('T')[0];
    const value =
      dataType === 'humidity'
        ? f.main.humidity
        : dataType === 'pressure'
        ? f.main.pressure
        : f.main.temp;

    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(value);
  });

  const labels = Object.keys(dailyData).sort();
  const data = labels.map(date => {
    const values = dailyData[date];
    return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  });

  return {
    labels,
    datasets: [
      {
        label: `${capitalizeFirst(dataType)} in ${city} ${unitFor(dataType)}`,
        data,
        borderColor: getColorFor(dataType),
        fill: false,
      },
    ],
  };
}
