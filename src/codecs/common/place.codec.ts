import { string as ioString, type as ioType, Type } from 'io-ts';
import { locationCodec } from './location.codec';
import { Place } from '@domain';

export const placeCodec: Type<Place> = ioType({
  context: ioString,
  label: ioString,
  location: locationCodec
});
