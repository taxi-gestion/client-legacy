/* eslint-disable @typescript-eslint/no-shadow */
import { number as ioNumber, Type, type as ioType } from 'io-ts';
import { Location } from '../../definitions';

export const locationCodec: Type<Location> = ioType(
  {
    latitude: ioNumber,
    longitude: ioNumber
  },
  'locationCodec'
);
