import {
  array as ioArray,
  intersection as ioIntersection,
  keyof as ioKeyOf,
  string as ioString,
  type as ioType,
  Type,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { Entity, Phone, RegularDetails } from '../../definitions';
import { entityCodec } from './traits.codecs';
import { placeCodec } from '../common';
import { destinationCodec } from './destination.codec';

export const phoneCodec: Type<Phone> = ioType({
  type: ioString,
  // eslint-disable-next-line id-denylist
  number: ioString
});

export const regularDetailsCodec: Type<RegularDetails> = ioType({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  civility: ioKeyOf({ Child: null, Company: null, Couple: null, Mr: null, Mrs: null, Other: null }),
  firstname: ioUnion([ioString, ioUndefined]),
  lastname: ioString,
  phones: ioUnion([ioArray(phoneCodec), ioUndefined]),
  home: ioUnion([placeCodec, ioUndefined]),
  destinations: ioUnion([ioArray(destinationCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export const regularDetailsEntityCodec: Type<Entity & RegularDetails> = ioIntersection([entityCodec, regularDetailsCodec]);
export const regularsDetailsEntitiesCodec: Type<(Entity & RegularDetails)[]> = ioArray(regularDetailsEntityCodec);
