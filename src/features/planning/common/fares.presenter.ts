import { Driver, Entity, Scheduled } from '@definitions';
import { toPassengerValues } from '@features/fare';
import { toDriverValues } from '@features/common/driver';
import { toWaypointValues } from '@features/common/waypoint';
import { utcToZonedTime } from 'date-fns-tz';
import { format, getHours, getMinutes } from 'date-fns';
import { secondsToMinutes } from '@features/common/presentation';
import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from './agenda.presenter';

const matchDriver =
  (driver: Driver & Entity) =>
  (fare: Entity & Scheduled): boolean =>
    fare.driver.id === driver.id;

export const toDailyDriverPlanning = (drivers: (Driver & Entity)[], fares: (Entity & Scheduled)[]): DailyDriverPlanning[] =>
  drivers.map((driver: Driver & Entity): DailyDriverPlanning => {
    const associatedFares: (Entity & Scheduled)[] = fares.filter(matchDriver(driver));
    return {
      driver,
      fares: toFaresForDatePlanningSession(toScheduledFaresPresentation(associatedFares))
    };
  });

export const toScheduledFaresPresentation = (fares: (Entity & Scheduled)[]): ScheduledPresentation[] =>
  fares.map(toScheduledFarePresentation);

export const toFaresForDatePlanningSession = (fares: ScheduledPresentation[]): ScheduledPlanningSession[] =>
  fares.map(toScheduledPlanningSession);

export const toScheduledFarePresentation = (fare: Entity & Scheduled): ScheduledPresentation => ({
  id: fare.id,
  passenger: toPassengerValues(fare.passenger),
  departure: toWaypointValues(fare.departure),
  arrival: toWaypointValues(fare.arrival),
  distance: fare.distance,
  duration: fare.duration,
  isTwoWayDrive: fare.kind === 'two-way',
  isMedicalDrive: fare.nature === 'medical',
  driver: toDriverValues(fare.driver),
  status: 'scheduled',
  datetime: fare.datetime,
  localTime: timeInTimezone(fare.datetime, 'Europe/Paris')
});

const timeInTimezone = (isoUtcDate: string, timeZone: string): string => {
  const dateInDesiredTimeZone: Date = utcToZonedTime(isoUtcDate, timeZone);
  return format(dateInDesiredTimeZone, 'HH:mm');
};

export const toScheduledPlanningSession = (fare: ScheduledPresentation): ScheduledPlanningSession => ({
  id: fare.id,
  passenger: fare.passenger,
  departure: fare.departure,
  arrival: fare.arrival,
  distance: Number((fare.distance * 0.001).toPrecision(3)),
  duration: secondsToMinutes(fare.duration),
  isTwoWayDrive: fare.isTwoWayDrive,
  isMedicalDrive: fare.isMedicalDrive,
  driver: fare.driver,
  status: fare.status,
  datetime: fare.datetime,
  localTime: fare.localTime,
  startTimeInMinutes: minutesSinceStartOfDayInTimezone(fare.datetime, 'Europe/Paris')
});

const minutesSinceStartOfDayInTimezone = (isoUtcDate: string, timeZone: string): number => {
  const dateInDesiredTimeZone: Date = utcToZonedTime(isoUtcDate, timeZone);
  return getHours(dateInDesiredTimeZone) * 60 + getMinutes(dateInDesiredTimeZone);
};
