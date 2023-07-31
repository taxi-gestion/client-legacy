import { getUnixTime, parseISO } from 'date-fns';
import { FareToScheduleTransfer } from '../../providers';

export type FormattedScheduleFareError = { field?: string; errors: Record<string, unknown> };
export const formatScheduleFareError = (_error: Error): FormattedScheduleFareError => ({
  errors: { unknown: true }
});

const dateToIso8601String = (date: string): string => `${date}T00:00:00.000Z`;

const timeToIso8601String = (time: string): string => `T${time}`;
export const toFareToScheduleTransfer = (formValues: FareToScheduleTransfer): FareToScheduleTransfer => ({
  clientIdentity: formValues.clientIdentity,
  clientPhone: formValues.clientPhone,
  date: dateToIso8601String(formValues.date),
  driveFrom: formValues.driveFrom,
  driveKind: formValues.driveKind,
  driveNature: formValues.driveNature,
  driveTo: formValues.driveTo,
  planning: formValues.planning,
  startTime: timeToIso8601String(formValues.startTime),
  recurrence: formValues.recurrence,
  distance: formValues.distance,
  duration: formValues.duration
});

// TODO A utiliser pour donner le departure_time à journey
export const timestampFromDateAndTime = (datetimeISO8601: string): number => {
  const dateTime: Date = parseISO(datetimeISO8601);
  return getUnixTime(dateTime);
};
