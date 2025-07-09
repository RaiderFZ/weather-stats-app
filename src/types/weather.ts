import type { ChartDataset, ChartTypeRegistry } from 'chart.js';

export type DataType = 'temperature' | 'humidity' | 'pressure';

export type CustomDataset<TType extends keyof ChartTypeRegistry = 'line'> =
    ChartDataset<TType> & {
    descriptionTooltips?: string[];
};

export interface ChartData {
  labels: string[];
  datasets: CustomDataset[];
}

export interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
  }[];
}

export interface CurrentWeather {
  temp: number;
  humidity: number;
  pressure: number;
  description: string;
  city: string;
  icon: string;
}

export type ChartType = 'line' | 'bar' | 'pie';