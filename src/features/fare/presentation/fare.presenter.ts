/* eslint-disable max-lines */
import {
  PassengerValues,
  PendingReturnValues,
  ScheduledFareValues,
  UnassignedFareValues
} from '../definitions/fare.definition';
import { Civility, Entity, Passenger, Pending, Scheduled, Unassigned, WithKind, WithNature } from '@definitions';
import { driverEmptyValue, DriverValues, toDriverValues } from '@features/common/driver';
import { emptyPhoneValue, PhoneValues, toPhone, toPhoneValues } from '@features/common/phone';
import { regularEmptyValue, RegularValues, toIdentity } from '@features/regular';
import { FareValues } from './fares.presentation';
import { emptyWaypointValue, toWaypointValues, WaypointValues } from '@features/common/waypoint';
import { sort } from 'fp-ts/Array';
import { contramap, getMonoid, Ord } from 'fp-ts/Ord';
import { Ord as ordString } from 'fp-ts/string';
import { Ord as ordDate } from 'fp-ts/Date';
import { Monoid } from 'fp-ts/Monoid';
import { pipe as fpipe } from 'fp-ts/function';

export const toScheduledFaresValues = (
  fares: (Entity & Scheduled)[] | (Entity & Scheduled) | undefined
): ScheduledFareValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toScheduledFareValues(fares)] : fares.map(toScheduledFareValues);
};

export const toUnassignedFaresValues = (
  fares: (Entity & Unassigned)[] | (Entity & Unassigned) | undefined
): UnassignedFareValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toUnassignedFareValues(fares)] : fares.map(toUnassignedFareValues);
};

export const toPendingReturnsValues = (fares: (Entity & Pending)[] | (Entity & Pending) | undefined): PendingReturnValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toPendingReturnValues(fares)] : fares.map(toPendingReturnValues);
};

export const toScheduledFareValues = (fare: Entity & Scheduled): ScheduledFareValues => ({
  datetime: fare.datetime,
  departure: toWaypointValues(fare.departure),
  arrival: toWaypointValues(fare.arrival),
  distance: fare.distance,
  driver: toDriverValues(fare.driver),
  duration: fare.duration,
  id: fare.id,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  passenger: toPassengerValues(fare.passenger),
  status: 'scheduled'
});

export const toUnassignedFareValues = (fare: Entity & Unassigned): UnassignedFareValues => ({
  datetime: fare.datetime,
  departure: toWaypointValues(fare.departure),
  arrival: toWaypointValues(fare.arrival),
  distance: fare.distance,
  duration: fare.duration,
  id: fare.id,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  passenger: toPassengerValues(fare.passenger),
  status: 'unassigned'
});

export const toPendingReturnValues = (fare: Entity & Pending): PendingReturnValues => ({
  datetime: fare.datetime,
  departure: toWaypointValues(fare.departure),
  arrival: toWaypointValues(fare.arrival),
  driver: toDriverValues(fare.driver),
  id: fare.id,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: true,
  passenger: toPassengerValues(fare.passenger),
  status: 'pending-return'
});

export const toPassengerValues = (passenger: Entity & Passenger): PassengerValues => ({
  id: passenger.id,
  civility: passenger.civility,
  lastname: passenger.lastname,
  firstname: passenger.firstname,
  phone: toPhoneValues(passenger.phone),
  comment: passenger.comment
});

export const toPassenger = (formValues: {
  passenger: { id: string; civility: Civility; firstname: string | undefined; lastname: string; comment: string | undefined };
  phoneToCall: PhoneValues;
}): Entity & Passenger => ({
  id: formValues.passenger.id,
  civility: formValues.passenger.civility,
  firstname: formValues.passenger.firstname,
  lastname: formValues.passenger.lastname,
  phone: toPhone(formValues.phoneToCall),
  comment: formValues.passenger.comment
});

export const isMedicalDrive = (nature: WithNature['nature']): boolean => nature === 'medical';
export const isTwoWayDrive = (kind: WithKind['kind']): boolean => kind === 'two-way';

export const initialFareValuesFromRegular = (regular: RegularValues): Partial<FareValues> => ({
  departurePlace: regular.waypoints?.[0] === undefined ? emptyWaypointValue : regular.waypoints[0],
  arrivalPlace: regular.waypoints?.[1] === undefined ? emptyWaypointValue : regular.waypoints[1],
  phoneToCall: regular.phones?.[0] === undefined ? emptyPhoneValue : regular.phones[0]
});

export const initialFareValuesFromScheduledAndRegular = (
  fare: ScheduledFareValues,
  regular: Entity & RegularValues
): Partial<Entity & FareValues> => ({
  id: fare.id,
  departurePlace: arrivalFromWaypoints(fare.departure, regular.waypoints) ?? emptyWaypointValue,
  arrivalPlace: arrivalFromWaypoints(fare.arrival, regular.waypoints) ?? emptyWaypointValue,
  phoneToCall: fare.passenger.phone,
  driver: fare.driver,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departureDatetime: fare.datetime,
  driveDuration: fare.duration,
  driveDistance: fare.distance
});

export const initialFareValuesFromUnassignedAndRegular = (
  fare: UnassignedFareValues,
  regular: Entity & RegularValues
): Partial<Entity & FareValues> => ({
  id: fare.id,
  departurePlace: arrivalFromWaypoints(fare.departure, regular.waypoints) ?? emptyWaypointValue,
  arrivalPlace: arrivalFromWaypoints(fare.arrival, regular.waypoints) ?? emptyWaypointValue,
  phoneToCall: fare.passenger.phone,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departureDatetime: fare.datetime,
  driveDuration: fare.duration,
  driveDistance: fare.distance
});

export const initialValuesFromPendingAndRegular = (
  fare: PendingReturnValues,
  regular: Entity & RegularValues
): Partial<Entity & FareValues> => ({
  id: fare.id,
  departurePlace: arrivalFromWaypoints(fare.departure, regular.waypoints) ?? emptyWaypointValue,
  arrivalPlace: arrivalFromWaypoints(fare.arrival, regular.waypoints) ?? emptyWaypointValue,
  phoneToCall: fare.passenger.phone,
  driver: fare.driver,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departureDatetime: fare.datetime
});

const arrivalFromWaypoints = (
  waypoint: WaypointValues | undefined,
  waypoints: WaypointValues[] | undefined
): WaypointValues | undefined =>
  waypoints?.find((destination: WaypointValues): boolean => destination.place.context === waypoint?.place.context);

export const passengerEmptyValue: Entity & PassengerValues = {
  civility: 'Mr',
  firstname: '',
  id: '',
  lastname: '',
  comment: undefined,
  phone: emptyPhoneValue
};

export const scheduledFareEmptyValue: ScheduledFareValues = {
  datetime: '',
  departure: emptyWaypointValue,
  arrival: emptyWaypointValue,
  distance: 0,
  driver: driverEmptyValue,
  duration: 0,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'scheduled'
};

export const unassignedFareEmptyValue: UnassignedFareValues = {
  datetime: '',
  departure: emptyWaypointValue,
  arrival: emptyWaypointValue,
  distance: 0,
  duration: 0,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'unassigned'
};

export const fareEmptyValue: FareValues = {
  passenger: regularEmptyValue,
  departureDatetime: '',
  departurePlace: emptyWaypointValue,
  arrivalPlace: emptyWaypointValue,
  driveDuration: 0,
  driveDistance: 0,
  driver: driverEmptyValue,
  isMedicalDrive: true,
  isTwoWayDrive: true,
  phoneToCall: emptyPhoneValue
};

export const pendingReturnEmptyValue: PendingReturnValues = {
  datetime: '',
  departure: emptyWaypointValue,
  arrival: emptyWaypointValue,
  driver: driverEmptyValue,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'pending-return'
};

type WithDriverAndDatetimeValues = { driver: DriverValues; datetime: string };
type WithPassengerValues = { passenger: PassengerValues };

export const filterOnPassengerAndDriverAndDatetime =
  <T extends WithDriverAndDatetimeValues & WithPassengerValues>(searchTerm: string) =>
  (combinedResults: T[]): T[] =>
    fpipe(combinedResults, filterByProperties(searchTerm), sortFaresByDriverAndDatetime);

export const filterByProperties =
  (searchTerm: string) =>
  <T extends WithDriverAndDatetimeValues & WithPassengerValues>(results: T[]): T[] =>
    results.filter((fareValue: T): boolean =>
      `${toIdentity(fareValue.passenger)}${fareValue.driver.username}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

export const sortFaresByDriverAndDatetime = <T extends WithDriverAndDatetimeValues>(fares: T[]): T[] =>
  sort(byDriverNameThenDatetime)(fares);

const byDriverName: Ord<WithDriverAndDatetimeValues> = contramap(
  (fare: { driver: DriverValues }): string => fare.driver.username
)(ordString);

const byDriverAndDatetime: Ord<WithDriverAndDatetimeValues> = contramap(
  (fare: { datetime: string }): Date => new Date(fare.datetime)
)(ordDate);

// Monoid instance to combine Ord instances
const ordMonoid: Monoid<Ord<WithDriverAndDatetimeValues>> = getMonoid<WithDriverAndDatetimeValues>();
const byDriverNameThenDatetime: Ord<WithDriverAndDatetimeValues> = ordMonoid.concat(byDriverName, byDriverAndDatetime);

type WithDatetimeValues = { datetime: string };

export const filterOnPassengerAndDatetime =
  <T extends WithDatetimeValues & WithPassengerValues>(searchTerm: string) =>
  (combinedResults: T[]): T[] =>
    fpipe(combinedResults, filterByPassengerProperties(searchTerm), sortFaresByDatetime);

const filterByPassengerProperties =
  (searchTerm: string) =>
  <T extends WithPassengerValues>(results: T[]): T[] =>
    results.filter((fareValue: T): boolean =>
      `${toIdentity(fareValue.passenger)}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

export const sortFaresByDatetime = <T extends WithDatetimeValues>(fares: T[]): T[] => sort(byDatetime)(fares);

const byDatetime: Ord<WithDatetimeValues> = contramap((fare: { datetime: string }): Date => new Date(fare.datetime))(ordDate);
