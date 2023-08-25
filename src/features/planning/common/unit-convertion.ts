import { utcToZonedTime, format } from 'date-fns-tz';
import { getHours, getMinutes } from 'date-fns';
import { DurationDistance, JourneyEstimate } from '@domain';

export const toStandardDateFormat = (date: Date): string => format(date, 'yyyy-MM-dd');

export const datetimeLocalToIso8601UTCString = (datetimeLocalISO8601: string): string =>
  new Date(datetimeLocalISO8601).toISOString();

export const formatDateToDatetimeLocalString = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm");

export const minutesSinceStartOfDayInTimezone = (isoUtcDate: string, timeZone: string): number => {
  const dateInDesiredTimeZone: Date = utcToZonedTime(isoUtcDate, timeZone);
  return getHours(dateInDesiredTimeZone) * 60 + getMinutes(dateInDesiredTimeZone);
};

export const timeInTimezone = (isoUtcDate: string, timeZone: string): string => {
  const dateInDesiredTimeZone: Date = utcToZonedTime(isoUtcDate, timeZone);
  return `${getHours(dateInDesiredTimeZone)}:${getMinutes(dateInDesiredTimeZone)}`;
};

export const secondsToMinutes = (duration: number): number => Math.round(duration / 60);
export const minutesToSeconds = (duration: number): number => Math.round(duration * 60);
export const metersToKilometers = (distance: number): number => Math.round(distance * 0.001);
export const kilometersToMeters = (distance: number): number => Math.round(distance * 1000);

export const toDisplayDurationDistance = (estimate: JourneyEstimate): DurationDistance => ({
  duration: secondsToMinutes(estimate.durationInSeconds),
  distance: metersToKilometers(estimate.distanceInMeters)
});
