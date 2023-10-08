import { format } from 'date-fns-tz';

export const toTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const datetimeLocalToIso8601UTCString = (datetimeLocalISO8601: string): string =>
  new Date(datetimeLocalISO8601).toISOString();

export const secondsToMinutes = (duration: number): number => Math.round(duration / 60);
export const minutesToSeconds = (duration: number): number => Math.round(duration * 60);

export const toValidLocalDatetimeInputValue = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm");
