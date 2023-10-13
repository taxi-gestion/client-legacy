/* eslint-disable @typescript-eslint/naming-convention */
import {
  intersection as ioIntersection,
  keyof as ioKeyOf,
  number as ioNumber,
  string as ioString,
  type as ioType,
  Type,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { Civility, Drive, DurationDistance, Entity, WithKind, WithNature, Passenger, Phone } from '../../definitions';

import { waypointCodec } from './waypointCodec';

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

export const withKindCodec: Type<WithKind> = ioType(
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kind: ioKeyOf({ 'one-way': null, 'two-way': null })
  },
  'withKindCodec'
);

export const withNatureCodec: Type<WithNature> = ioType(
  {
    nature: ioKeyOf({ medical: null, standard: null })
  },
  'withNatureCodec'
);

export const driveCodec: Type<Drive> = ioType(
  {
    datetime: ioString,
    departure: waypointCodec,
    arrival: waypointCodec
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
    number: ioString
  },
  'phoneCodec'
);

export const passengerCodec: Type<Passenger> = ioType(
  {
    civility: civilityCodec,
    firstname: ioUnion([ioString, ioUndefined]),
    lastname: ioString,
    phone: phoneCodec,
    comment: ioUnion([ioString, ioUndefined])
  },
  'passengerCodec'
);

export const passengerEntityCodec: Type<Entity & Passenger> = ioIntersection(
  [entityCodec, passengerCodec],
  'passengerEntityCodec'
);
