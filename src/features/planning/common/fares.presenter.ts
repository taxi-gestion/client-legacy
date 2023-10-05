/* eslint-disable max-lines */
import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from './fares.presentation';
import {
  datetimeLocalToIso8601UTCString,
  formatDateToDatetimeLocalString,
  minutesSinceStartOfDayInTimezone,
  timeInTimezone
} from './unit-convertion';
import { addMinutes, format, secondsToMinutes, subHours } from 'date-fns';
import { Driver, Entity, Journey, Passenger, Place, Scheduled } from '@definitions';
import { throwDecodeError } from './regular.presenter';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { journeyCodec } from '@codecs';
import { placeEmptyValue, PlaceValues, toPlacesValues, toPlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';
import { FareToScheduleValues } from '../pages/schedule-fare/schedule-fare.form';
import { PhoneValues, toPhone } from '@features/common/phone';
import { RegularValues } from '@features/common/regular';
import { toPassengerValues } from '@features/common/fare';
import { toDriverValues } from '@features/common/driver';

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
  departure: toPlaceValues(fare.departure),
  destination: toPlaceValues(fare.destination),
  distance: fare.distance,
  duration: fare.duration,
  isTwoWayDrive: fare.kind === 'two-way',
  isMedicalDrive: fare.nature === 'medical',
  driver: toDriverValues(fare.driver),
  status: 'scheduled',
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
  isTwoWayDrive: fare.isTwoWayDrive,
  isMedicalDrive: fare.isMedicalDrive,
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
  civility: formValues.passenger.civility,
  firstname: formValues.passenger.firstname,
  lastname: formValues.passenger.lastname,
  phone: toPhone(formValues.phoneToCall)
});

export const localDatetimeString = (): string => formatDateToDatetimeLocalString(new Date());

export type RegularPresentation = {
  id: string;
  phone: PhoneValues | undefined;
  destination: DestinationValues | undefined;
  destinations: DestinationValues[];
  departure: PlaceValues | undefined;
  departures: PlaceValues[];
  phones: PhoneValues[];
};

export const toRegularPresentation = (regular: Entity & RegularValues): RegularPresentation => ({
  id: regular.id,
  phone: regular.phones === undefined ? undefined : regular.phones[0],
  departure: regular.homeAddress,
  departures: toPlacesValues(regular.homeAddress),
  phones: regular.phones === undefined ? [] : regular.phones,
  destination: regular.destinations === undefined ? undefined : regular.destinations[0],
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  destinations: destinationsWithDomicile(regular.destinations, regular.homeAddress ?? placeEmptyValue)
});

export const domicileAsDestination = (place: PlaceValues): DestinationValues => ({
  destinationName: 'Domicile',
  place,
  isMedicalDrive: undefined,
  isTwoWayDrive: undefined,
  comment: undefined
});

export const destinationsWithDomicile = (
  destinations: DestinationValues[] | undefined,
  domicile: PlaceValues
): DestinationValues[] =>
  destinations === undefined ? [domicileAsDestination(domicile)] : [...destinations, domicileAsDestination(domicile)];
