/* eslint-disable max-lines */
import {
  PassengerValues,
  PendingReturnValues,
  ScheduledFareValues,
  UnassignedFareValues
} from '../definitions/fare.definition';
import {
  Civility,
  DeleteFare,
  Entity,
  Passenger,
  Pending,
  Recurring,
  Scheduled,
  Unassigned,
  WithKind,
  WithNature
} from '@definitions';
import { driverEmptyValue, DriverValues, toDriverValues } from '@features/common/driver';
import { emptyPhoneValue, PhoneValues, toPhone, toPhoneValues } from '@features/common/phone';
import { regularEmptyValue, RegularValues, toIdentity } from '@features/regular';
import { FareValues } from './fares.presentation';
import { emptyWaypointValue, toWaypointValues, WaypointValues } from '@features/common/waypoint';
import { findFirst, sort } from 'fp-ts/Array';
import { contramap, getMonoid, Ord } from 'fp-ts/Ord';
import { Ord as ordString } from 'fp-ts/string';
import { Ord as ordDate } from 'fp-ts/Date';
import { Monoid } from 'fp-ts/Monoid';
import { pipe as fpipe } from 'fp-ts/function';
import { Toast } from '../../../root/components/toaster/toaster.presenter';
import { toTime } from '../../common/presentation';
import { Observable, of, throwError } from 'rxjs';
import { fold as optionFold } from 'fp-ts/Option';
import { Params } from '@angular/router';

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
  status: 'scheduled',
  creator: fare.creator
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
  driver: fare.driver === undefined ? undefined : toDriverValues(fare.driver),
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
): Partial<Entity & FareValues> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    id: fare.id,
    departurePlace: arrivalFromWaypoints(fare.departure, regular.waypoints) ?? emptyWaypointValue,
    arrivalPlace: arrivalFromWaypoints(fare.arrival, regular.waypoints) ?? emptyWaypointValue,
    phoneToCall: fare.passenger.phone,
    driver: fare.driver,
    isMedicalDrive: fare.isMedicalDrive,
    isTwoWayDrive: fare.isTwoWayDrive,
    departureDatetime: fare.datetime
  } as Partial<Entity & FareValues>);

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
  status: 'scheduled',
  creator: 'manager'
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

type WithDriverAndDatetimeValues = { driver: DriverValues | undefined; datetime: string };
type WithPassengerValues = { passenger: PassengerValues };

export const filterOnPassengerAndDriverAndDatetime =
  <T extends WithDriverAndDatetimeValues & WithPassengerValues>(searchTerm: string) =>
  (combinedResults: T[]): T[] =>
    fpipe(combinedResults, filterByProperties(searchTerm), sortFaresByDriverAndDatetime);

export const filterByProperties =
  (searchTerm: string) =>
  <T extends WithDriverAndDatetimeValues & WithPassengerValues>(results: T[]): T[] =>
    results.filter((fareValue: T): boolean =>
      `${toIdentity(fareValue.passenger)}${fareValue.driver?.username}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

export const sortFaresByDriverAndDatetime = <T extends WithDriverAndDatetimeValues>(fares: T[]): T[] =>
  sort(byDriverNameThenDatetime)(fares);

const byDriverName: Ord<WithDriverAndDatetimeValues> = contramap(
  (fare: { driver: DriverValues | undefined }): string => fare.driver?.username ?? ''
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

export const toDeleteFareSuccessToasts = (fares: DeleteFare): Toast[] => [
  ...(fares.scheduledDeleted === undefined ? [] : [toDeleteScheduledSuccessToast(fares.scheduledDeleted)]),
  ...(fares.unassignedDeleted === undefined ? [] : [toDeleteUnassignedSuccessToast(fares.unassignedDeleted)]),
  ...(fares.pendingDeleted === undefined ? [] : [toDeletePendingSuccessToast(fares.pendingDeleted)]),
  ...(fares.recurringDeleted === undefined ? [] : [toDeleteRecurringSuccessToast(fares.recurringDeleted)])
];
const toDeleteScheduledSuccessToast = (scheduled: Scheduled): Toast => ({
  content: `Course pour ${toIdentity(scheduled.passenger)} par ${scheduled.driver.username} à ${toTime(
    scheduled.datetime
  )} supprimée`,
  status: 'success',
  title: 'Une course a été supprimée'
});
const toDeleteUnassignedSuccessToast = (unassigned: Unassigned): Toast => ({
  content: `Course non assignée pour ${toIdentity(unassigned.passenger)} à ${toTime(unassigned.datetime)} supprimée`,
  status: 'success',
  title: 'Une course a été supprimée'
});
const toDeletePendingSuccessToast = (pending: Pending): Toast => ({
  content: `Retour pour ${toIdentity(pending.passenger)} supprimé`,
  status: 'success',
  title: 'Un retour a été supprimé'
});

const toDeleteRecurringSuccessToast = (recurring: Recurring): Toast => ({
  content: `Règle de récurrence pour ${toIdentity(recurring.passenger)} supprimée`,
  status: 'success',
  title: 'Une règle de récurrence a été supprimée'
});

type WithId = { id: string };
export const findMatchingFare = <T extends WithId>([fares, id]: [T[], string]): Observable<T> =>
  fpipe(
    fares,
    findFirst((fare: T): boolean => fare.id === id),
    optionFold(
      (): Observable<never> => throwError((): Error => new Error('Fare not found')),
      (fare: T): Observable<T> => of(fare)
    )
  );

const UUID_LENGTH: 36 = 36 as const;
const isValidUuid = (uuid: unknown): uuid is string =>
  uuid === null || typeof uuid !== 'string' ? false : uuid.length === UUID_LENGTH;
export const routeParamToFareId = (keyInParams: string, params: Params): string | undefined => {
  const uuid: unknown = params[keyInParams];
  return isValidUuid(uuid) ? uuid : undefined;
};

type WithSummaryProperties = {
  datetime: string;
  passenger: PassengerValues;
  arrival: WaypointValues;
};
export const toFareSummary = <T extends WithSummaryProperties>(fare: T): string =>
  ` ${toTime(fare.datetime)} - ${toIdentity(fare.passenger)} - ${fare.arrival.place.label}`;
