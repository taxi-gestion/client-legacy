import {
  intersection as ioIntersection,
  string as ioString,
  type as ioType,
  Type,
  array as ioArray,
  union as ioUnion,
  keyof as ioKeyOf,
  undefined as ioUndefined
} from 'io-ts';
import { Entity, Phone, Regular, RegularDetails } from '../../definitions';
import { entityCodec } from './traits.codecs';
import { placeCodec } from '../common';

export const regularCodec: Type<Regular> = ioType({
  firstname: ioString,
  lastname: ioString
});

export const phoneCodec: Type<Phone> = ioType({
  name: ioString,
  // eslint-disable-next-line id-denylist
  number: ioString
});

export const regularDetailsCodec: Type<RegularDetails> = ioType({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  civility: ioKeyOf({ Mr: null, Mrs: null }),
  firstname: ioString,
  lastname: ioString,
  phones: ioUnion([ioArray(phoneCodec), ioUndefined]),
  home: ioUnion([placeCodec, ioUndefined]),
  destinations: ioUnion([ioArray(placeCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export const regularPassengerEntityCodec: Type<Entity & Regular> = ioIntersection([entityCodec, regularCodec]);
export const regularDetailsEntityCodec: Type<Entity & RegularDetails> = ioIntersection([entityCodec, regularDetailsCodec]);
export const regularsDetailsEntitiesCodec: Type<(Entity & RegularDetails)[]> = ioArray(regularDetailsEntityCodec);
