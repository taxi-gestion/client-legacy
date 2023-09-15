import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from './fares.presentation';
import {
  datetimeLocalToIso8601UTCString,
  formatDateToDatetimeLocalString,
  minutesSinceStartOfDayInTimezone,
  timeInTimezone
} from './unit-convertion';
import { addMinutes, format, secondsToMinutes, subHours } from 'date-fns';
import { Driver, Entity, Journey, Passenger, Place, Scheduled } from '@definitions';
import { FareToScheduleValues } from '../pages/schedule-fare/schedule-fare.form';
import { regularIdentity } from './regular.presenter';

export const defaultPlaceValue: Place = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};

export const toJourney = (formValues: { departurePlace: Place; arrivalPlace: Place; departureDatetime: string }): Journey => ({
  origin: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  departureTime: datetimeLocalToIso8601UTCString(formValues.departureDatetime)
});

export function toDailyDriverPlanning(drivers: (Driver & Entity)[], fares: (Entity & Scheduled)[]): DailyDriverPlanning[] {
  return drivers.map((driver: Driver & Entity): DailyDriverPlanning => {
    const associatedFares: (Entity & Scheduled)[] = fares.filter((fare: Entity & Scheduled): boolean => fare.driver === driver);
    return {
      driver,
      fares: toFaresForDatePlanningSession(toScheduledFaresPresentation(associatedFares))
    };
  });
}

export const toScheduledFaresPresentation = (fares: (Entity & Scheduled)[]): ScheduledPresentation[] =>
  fares.map(toScheduledFarePresentation);

export const toFaresForDatePlanningSession = (fares: ScheduledPresentation[]): ScheduledPlanningSession[] =>
  fares.map(toScheduledPlanningSession);

export const toScheduledFarePresentation = (fare: Entity & Scheduled): ScheduledPresentation => ({
  id: fare.id,
  passenger: fare.passenger,
  departure: fare.departure,
  destination: fare.destination,
  distance: fare.distance,
  duration: fare.duration,
  kind: fare.kind,
  nature: fare.nature,
  driver: fare.driver,
  status: fare.status,
  datetime: fare.datetime,
  localTime: timeInTimezone(fare.datetime, 'Europe/Paris')
});

export const toScheduledPlanningSession = (fare: ScheduledPresentation): ScheduledPlanningSession => ({
  id: fare.id,
  passenger: fare.passenger,
  departure: fare.departure,
  destination: fare.destination,
  distance: Number((fare.distance * 0.001).toPrecision(3)),
  duration: secondsToMinutes(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  driver: fare.driver,
  status: fare.status,
  datetime: fare.datetime,
  localTime: fare.localTime,
  startTimeInMinutes: minutesSinceStartOfDayInTimezone(fare.datetime, 'Europe/Paris')
});

export const toLocalTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const toLocalDatetimeString = (dateString: string, timeInMinutes: number): string =>
  formatDateToDatetimeLocalString(subHours(addMinutes(new Date(dateString), timeInMinutes), 2));

export const regularOrStringToPassenger = (formValues: FareToScheduleValues): Passenger =>
  typeof formValues.passenger === 'string'
    ? { passenger: formValues.passenger, phone: formValues.phoneToCall }
    : { passenger: regularIdentity(formValues.passenger), phone: formValues.phoneToCall };

export const localDatetimeString = (): string => formatDateToDatetimeLocalString(new Date());
