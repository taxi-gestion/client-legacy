import { number as ioNumber, Type, type as ioType } from 'io-ts';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { Location } from '../../definitions';

export const locationCodec: Type<Location> = ioType({
  latitude: ioNumber,
  longitude: ioNumber
});
