import { format } from 'date-fns';

export const isoTimeToMinutes = (timeString: string): number => {
  const parts: string[] | undefined = timeString.split(':');
  const hours: number = parseInt(parts[0] ?? '0', 10) * 60;
  const minutes: number = parseInt(parts[1] ?? '0', 10);
  return hours + minutes;
};
export const toStandardDateFormat = (date: Date): string => format(date, 'yyyy-MM-dd');

export const datetimeLocalToIso8601UTCString = (datetimeLocalISO8601: string): string =>
  new Date(datetimeLocalISO8601).toISOString();
export const formatDateToDatetimeLocalString = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm");
