import { PassengerValues, PendingReturnValues, ScheduledFareValues } from './definitions/fare.definition';
import { Entity, Passenger, Pending, Scheduled } from '@definitions';
import { placeEmptyValue, toPlaceValues } from '@features/common/place';
import { driverEmptyValue, toDriverValues } from '@features/common/driver';
import { phoneEmptyValue, toPhoneValues } from '@features/common/phone';

export const passengerEmptyValue: Entity & PassengerValues = {
  civility: 'Mr',
  firstname: '',
  id: '',
  lastname: '',
  phone: phoneEmptyValue
};

export const scheduledFareEmptyValue: ScheduledFareValues = {
  datetime: '',
  departure: placeEmptyValue,
  destination: placeEmptyValue,
  distance: 0,
  driver: driverEmptyValue,
  duration: 0,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'scheduled'
};

export const pendingReturnEmptyValue: PendingReturnValues = {
  datetime: '',
  departure: placeEmptyValue,
  destination: placeEmptyValue,
  driver: driverEmptyValue,
  id: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  passenger: passengerEmptyValue,
  status: 'pending-return'
};

//
//export const toFare = (fareValue: ScheduledFareValues): Fare => ({
//  ...fareValue
//});
//
//export const toFareValuesOrUndefined = (fare: Fare | ScheduledFareValues | undefined): ScheduledFareValues | undefined =>
//  fare === undefined ? undefined : fare;
//
export const toScheduledFaresValues = (
  fares: (Entity & Scheduled)[] | (Entity & Scheduled) | undefined
): ScheduledFareValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toScheduledFareValues(fares)] : fares.map(toScheduledFareValues);
};

export const toPendingFaresValues = (fares: (Entity & Pending)[] | (Entity & Pending) | undefined): PendingReturnValues[] => {
  if (fares === undefined) return [];

  return 'id' in fares ? [toPendingFareValues(fares)] : fares.map(toPendingFareValues);
};

export const toScheduledFareValues = (fare: Entity & Scheduled): ScheduledFareValues => ({
  datetime: fare.datetime,
  departure: toPlaceValues(fare.departure),
  destination: toPlaceValues(fare.destination),
  distance: fare.distance,
  driver: toDriverValues(fare.driver),
  duration: fare.duration,
  id: fare.id,
  isMedicalDrive: fare.nature === 'medical',
  isTwoWayDrive: fare.kind === 'two-way',
  passenger: toPassengerValues(fare.passenger),
  status: 'scheduled'
});

export const toPendingFareValues = (fare: Entity & Pending): PendingReturnValues => ({
  datetime: fare.datetime,
  departure: toPlaceValues(fare.departure),
  destination: toPlaceValues(fare.destination),
  driver: toDriverValues(fare.driver),
  id: fare.id,
  isMedicalDrive: fare.nature === 'medical',
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
//
//export const toFareValues = (fare: Fare): ScheduledFareValues => fare;
