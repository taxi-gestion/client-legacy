import { number as ioNumber, string as ioString, type as ioType, Type } from 'io-ts';
import { Drive, Driver, DurationDistance, Entity, Passenger } from '../../definitions';
import { placeCodec } from '../common';

export const entityCodec: Type<Entity> = ioType({
  id: ioString
});

export const driverCodec: Type<Driver> = ioType({
  identifier: ioString,
  username: ioString
});

export const driveCodec: Type<Drive> = ioType({
  datetime: ioString,
  departure: placeCodec,
  destination: placeCodec,
  driver: ioString
});

export const durationDistanceCodec: Type<DurationDistance> = ioType({
  duration: ioNumber,
  distance: ioNumber
});

export const passengerCodec: Type<Passenger> = ioType({
  passenger: ioString,
  phone: ioString
});
