import {
  intersection as ioIntersection,
  string as ioString,
  type as ioType,
  Type,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { Destination } from '../../definitions';
import { kindCodec, natureCodec } from './traits.codecs';
import { placeCodec } from '../common';

export const destinationCodec: Type<Destination> = ioIntersection([
  kindCodec,
  natureCodec,
  ioType({
    place: placeCodec,
    comment: ioUnion([ioString, ioUndefined]),
    name: ioString
  })
]);
