import { keyof as ioKeyof, number as ioNumber, string as ioString, type as ioType, Type } from 'io-ts';
import { Drive, Driver, DurationDistance, Entity, Kind, Nature, Passenger } from '../../definitions';
import { placeCodec } from '../common';

export const entityCodec: Type<Entity> = ioType({
  id: ioString
});

export const driverCodec: Type<Driver> = ioType({
  identifier: ioString,
  username: ioString
});

export const kindCodec: Type<Kind> = ioType({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  kind: ioKeyof({ 'one-way': null, 'two-way': null })
});

export const natureCodec: Type<Nature> = ioType({
  nature: ioKeyof({ medical: null, standard: null })
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
