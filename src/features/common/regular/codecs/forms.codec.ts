import {
  array as ioArray,
  string as ioString,
  Type,
  undefined as ioUndefined,
  union as ioUnion,
  type as ioType,
  intersection as ioIntersection
} from 'io-ts';
import { RegularValues } from '../definitions';
import { civilityCodec, entityCodec } from '@codecs';
import { phoneValuesCodec } from '@features/common/phone';
import { placeValuesCodec } from '@features/common/place';
import { destinationValuesCodec } from '@features/common/destination';
import { Entity } from '@definitions';

export const regularValuesCodec: Type<RegularValues> = ioType({
  civility: civilityCodec,
  firstname: ioUnion([ioString, ioUndefined]),
  lastname: ioString,
  phones: ioUnion([ioArray(phoneValuesCodec), ioUndefined]),
  homeAddress: ioUnion([placeValuesCodec, ioUndefined]),
  destinations: ioUnion([ioArray(destinationValuesCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export const regularValuesEntityCodec: Type<Entity & RegularValues> = ioIntersection([entityCodec, regularValuesCodec]);
