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
import { Destination, Entity, Phone, Regular, RegularDetails } from '../../definitions';
import { entityCodec, kindCodec, natureCodec } from './traits.codecs';
import { placeCodec } from '../common';

export const regularCodec: Type<Regular> = ioType({
  firstname: ioUnion([ioString, ioUndefined]),
  lastname: ioString
});

export const phoneCodec: Type<Phone> = ioType({
  type: ioString,
  // eslint-disable-next-line id-denylist
  number: ioString
});

export const destinationCodec: Type<Destination> = ioIntersection([
  kindCodec,
  natureCodec,
  ioType({
    place: placeCodec,
    comment: ioUnion([ioString, ioUndefined]),
    name: ioString
  })
]);

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

export const regularPassengerEntityCodec: Type<Entity & Regular> = ioIntersection([entityCodec, regularCodec]);
export const regularDetailsEntityCodec: Type<Entity & RegularDetails> = ioIntersection([entityCodec, regularDetailsCodec]);
export const regularsDetailsEntitiesCodec: Type<(Entity & RegularDetails)[]> = ioArray(regularDetailsEntityCodec);
