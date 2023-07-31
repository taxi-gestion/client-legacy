import { format } from 'date-fns';

export const metersToKilometersString = (meters: number): string => `${(meters / 1000).toFixed(1)} km`;

export const isoTimeToMinutes = (timeString: string): number => {
  const parts: string[] | undefined = timeString.split(':');
  const hours: number = parseInt(parts[0] ?? '0', 10) * 60;
  const minutes: number = parseInt(parts[1] ?? '0', 10);
  return hours + minutes;
};
export const toStandardDateFormat = (date: Date): string => format(date, 'yyyy-MM-dd');
