/* eslint-disable @typescript-eslint/naming-convention */
import {
  intersection as ioIntersection,
  keyof as ioKeyOf,
  number as ioNumber,
  string as ioString,
  type as ioType,
  Type
} from 'io-ts';
import { Civility, Drive, DurationDistance, Entity, Kind, Nature, Passenger, Phone } from '../../definitions';
import { placeCodec } from '../common';

export const entityCodec: Type<Entity> = ioType(
  {
    id: ioString
  },
  'entityCodec'
);

export const civilityCodec: Type<Civility> = ioKeyOf(
  {
    Child: null,
    Company: null,
    Couple: null,
    Mr: null,
    Mrs: null,
    Other: null
  },
  'civilityCodec'
);

export const kindCodec: Type<Kind> = ioType(
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kind: ioKeyOf({ 'one-way': null, 'two-way': null })
  },
  'kindCodec'
);

export const natureCodec: Type<Nature> = ioType(
  {
    nature: ioKeyOf({ medical: null, standard: null })
  },
  'natureCodec'
);

export const driveCodec: Type<Drive> = ioType(
  {
    datetime: ioString,
    departure: placeCodec,
    destination: placeCodec
  },
  'driveCodec'
);

export const durationDistanceCodec: Type<DurationDistance> = ioType(
  {
    duration: ioNumber,
    distance: ioNumber
  },
  'durationDistanceCodec'
);

export const phoneCodec: Type<Phone> = ioType(
  {
    type: ioString,
    // eslint-disable-next-line id-denylist
    number: ioString
  },
  'phoneCodec'
);

export const passengerCodec: Type<Passenger> = ioType(
  {
    identity: ioString,
    phone: phoneCodec
  },
  'passengerCodec'
);

export const passengerEntityCodec: Type<Entity & Passenger> = ioIntersection(
  [entityCodec, passengerCodec],
  'passengerEntityCodec'
);
