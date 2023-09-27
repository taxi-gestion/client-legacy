import { PassengerValues, ScheduledFareValues } from './definitions/fare.definition';
import { Entity, Passenger, Scheduled } from '@definitions';
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

export const toPassengerValues = (passenger: Entity & Passenger): PassengerValues => ({
  id: passenger.id,
  civility: passenger.civility,
  lastname: passenger.lastname,
  firstname: passenger.firstname,
  phone: toPhoneValues(passenger.phone)
});
//
//export const toFareValues = (fare: Fare): ScheduledFareValues => fare;
