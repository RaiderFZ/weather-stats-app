export type DataType = 'temperature' | 'humidity' | 'pressure';

export const capitalizeFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const unitFor = (type: DataType) => {
  if (type === 'temperature') return '(°C)';
  if (type === 'humidity') return '(%)';
  if (type === 'pressure') return '(hPa)';
  return '';
};

export const getColorFor = (type: DataType) => {
  if (type === 'temperature') return 'rgba(75, 192, 192, 1)';
  if (type === 'humidity') return 'rgba(54, 162, 235, 1)';
  if (type === 'pressure') return 'rgba(153, 102, 255, 1)';
  return 'rgba(75, 192, 192, 1)';
};

export function getColorPalette(count: number): string[] {
  const palette = [
    '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
    '#F472B6', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'
  ];

  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}