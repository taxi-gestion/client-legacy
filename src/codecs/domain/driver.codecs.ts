import { intersection as ioIntersection, string as ioString, type as ioType, Type } from 'io-ts';
import { Driver, Entity } from '../../definitions';
import { entityCodec } from './traits.codecs';

export const driverCodec: Type<Driver> = ioType(
  {
    identifier: ioString,
    username: ioString
  },
  'driverCodec'
);

export const driverEntityCodec: Type<Driver & Entity> = ioIntersection([entityCodec, driverCodec], 'driverEntityCodec');
