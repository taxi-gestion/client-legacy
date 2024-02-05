import { string as ioString, type as ioType, Type } from 'io-ts';
import { Place } from '../../definitions';

export const placeCodec: Type<Place> = ioType(
  {
    context: ioString,
    label: ioString
    //location: ioUnion([locationCodec, ioUndefined])
  },
  'placeCodec'
);
