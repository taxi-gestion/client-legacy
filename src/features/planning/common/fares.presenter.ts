import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from './fares.presentation';
import {
  datetimeLocalToIso8601UTCString,
  formatDateToDatetimeLocalString,
  minutesSinceStartOfDayInTimezone,
  timeInTimezone
} from './unit-convertion';
import { addMinutes, format, secondsToMinutes, subHours } from 'date-fns';
import { Driver, Entity, Journey, Passenger, Place, RegularDetails, Scheduled } from '@definitions';
import { FareToScheduleValues } from '../pages/schedule-fare/schedule-fare.form';
import { passengerIdentity, throwDecodeError } from './regular.presenter';
import { toPhone } from '@features/common/phone';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { journeyCodec } from '@codecs';
import { PlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';

export const defaultPlaceValue: Place = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};

const toJourneyDomain = (formValues: {
  departurePlace: PlaceValues;
  arrivalPlace: DestinationValues;
  departureDatetime: string;
}): unknown => ({
  origin: formValues.departurePlace,
  destination: formValues.arrivalPlace.place,
  departureTime: datetimeLocalToIso8601UTCString(formValues.departureDatetime)
});
// TODO Import some rule codecs, should use a local journeyFormCodec with date and places rules
export const toJourney = (rawFormValues: unknown): Journey => {
  const tempUgly: unknown = toJourneyDomain(
    rawFormValues as { departurePlace: PlaceValues; arrivalPlace: DestinationValues; departureDatetime: string }
  );
  return fpPipe(
    journeyCodec.decode(tempUgly),
    eitherFold(throwDecodeError('journeyCodec', rawFormValues), (values: Journey): Journey => values)
  );
};

const matchDriver =
  (driver: Driver & Entity) =>
  (fare: Entity & Scheduled): boolean =>
    fare.driver.id === driver.id;

export function toDailyDriverPlanning(drivers: (Driver & Entity)[], fares: (Entity & Scheduled)[]): DailyDriverPlanning[] {
  return drivers.map((driver: Driver & Entity): DailyDriverPlanning => {
    const associatedFares: (Entity & Scheduled)[] = fares.filter(matchDriver(driver));
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

export const regularToPassenger = (formValues: FareToScheduleValues): Entity & Passenger => ({
  id: formValues.passenger.id,
  identity: passengerIdentity(formValues.passenger),
  phone: toPhone(formValues.phoneToCall)
});

export const localDatetimeString = (): string => formatDateToDatetimeLocalString(new Date());

export const toFormPassenger = (
  regular: Entity & RegularDetails
): Entity & Pick<RegularDetails, 'civility' | 'firstname' | 'lastname'> => ({
  id: regular.id,
  civility: regular.civility,
  firstname: regular.firstname,
  lastname: regular.lastname
});
