/* eslint-disable max-lines */
import { PassengerValues, PendingReturnValues, ScheduledFareValues } from '../definitions/fare.definition';
import { Civility, Entity, Kind, Nature, Passenger, Pending, Scheduled } from '@definitions';
import { emptyPlaceValue, PlaceValues, toPlaceValues } from '@features/common/place';
import { driverEmptyValue, toDriverValues } from '@features/common/driver';
import { emptyPhoneValue, PhoneValues, toPhone, toPhoneValues } from '@features/common/phone';
import { DestinationValues, emptyDestinationValue } from '@features/common/destination';
import { regularEmptyValue, RegularValues } from '@features/common/regular';
import { FareValues } from './fares.presentation';

export const toScheduledFaresValues = (
  fares: (Entity & Scheduled)[] | (Entity & Scheduled) | undefined
): ScheduledFareValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toScheduledFareValues(fares)] : fares.map(toScheduledFareValues);
};

export const toPendingReturnsValues = (fares: (Entity & Pending)[] | (Entity & Pending) | undefined): PendingReturnValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toPendingReturnValues(fares)] : fares.map(toPendingReturnValues);
};

export const toScheduledFareValues = (fare: Entity & Scheduled): ScheduledFareValues => ({
  datetime: fare.datetime,
  departure: toPlaceValues(fare.departure),
  destination: toPlaceValues(fare.destination),
  distance: fare.distance,
  driver: toDriverValues(fare.driver),
  duration: fare.duration,
  id: fare.id,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  passenger: toPassengerValues(fare.passenger),
  status: 'scheduled'
});

export const toPendingReturnValues = (fare: Entity & Pending): PendingReturnValues => ({
  datetime: fare.datetime,
  departure: toPlaceValues(fare.departure),
  destination: toPlaceValues(fare.destination),
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
  phone: toPhoneValues(passenger.phone)
});

export const toPassenger = (formValues: {
  passenger: { id: string; civility: Civility; firstname: string | undefined; lastname: string };
  phoneToCall: PhoneValues;
}): Entity & Passenger => ({
  id: formValues.passenger.id,
  civility: formValues.passenger.civility,
  firstname: formValues.passenger.firstname,
  lastname: formValues.passenger.lastname,
  phone: toPhone(formValues.phoneToCall)
});

export const isMedicalDrive = (nature: Nature['nature']): boolean => nature === 'medical';
export const isTwoWayDrive = (kind: Kind['kind']): boolean => kind === 'two-way';

export const initialFareValuesFromRegular = (regular: RegularValues): Partial<FareValues> => ({
  departurePlace: regular.homeAddress === undefined ? emptyPlaceValue : regular.homeAddress,
  arrivalPlace: regular.destinations?.[0] === undefined ? emptyDestinationValue : regular.destinations[0],
  phoneToCall: regular.phones?.[0] === undefined ? emptyPhoneValue : regular.phones[0]
});

export const initialFareValuesFromScheduledAndRegular = (
  fare: ScheduledFareValues,
  regular: Entity & RegularValues
): Partial<FareValues> => ({
  departurePlace: fare.departure,
  // TODO Refactor once ScheduledFareValues contain Destinations only
  arrivalPlace: destinationFromDestinations(fare.destination, regular.destinations) ?? emptyDestinationValue,
  phoneToCall: fare.passenger.phone,
  driver: fare.driver,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departureDatetime: fare.datetime,
  driveDuration: fare.duration,
  driveDistance: fare.distance
});

export const destinationFromDestinations = (
  place: PlaceValues | undefined,
  destinations: DestinationValues[] | undefined
): DestinationValues | undefined =>
  destinations?.find((destination: DestinationValues): boolean => destination.place.label === place?.label);

export const passengerEmptyValue: Entity & PassengerValues = {
  civility: 'Mr',
  firstname: '',
  id: '',
  lastname: '',
  phone: emptyPhoneValue
};

export const scheduledFareEmptyValue: ScheduledFareValues = {
  datetime: '',
  departure: emptyPlaceValue,
  destination: emptyPlaceValue,
  distance: 0,
  driver: driverEmptyValue,
  duration: 0,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'scheduled'
};

export const fareEmptyValue: FareValues = {
  passenger: regularEmptyValue,
  departureDatetime: '',
  departurePlace: emptyPlaceValue,
  arrivalPlace: emptyDestinationValue,
  driveDuration: 0,
  driveDistance: 0,
  driver: driverEmptyValue,
  isMedicalDrive: true,
  isTwoWayDrive: true,
  phoneToCall: emptyPhoneValue
};

export const pendingReturnEmptyValue: PendingReturnValues = {
  datetime: '',
  departure: emptyPlaceValue,
  destination: emptyPlaceValue,
  driver: driverEmptyValue,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'pending-return'
};
