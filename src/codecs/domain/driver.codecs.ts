import {
  array as ioArray,
  intersection as ioIntersection,
  number as ioNumber,
  string as ioString,
  type as ioType,
  Type
} from 'io-ts';
import { Driver, DriverWithOrder, Entity } from '../../definitions';
import { entityCodec } from './traits.codecs';

export const driverCodec: Type<Driver> = ioType(
  {
    identifier: ioString,
    username: ioString
  },
  'driverCodec'
);

export const driverEntityCodec: Type<Driver & Entity> = ioIntersection([entityCodec, driverCodec], 'driverEntityCodec');

// TODO Is there a better way than having to define this ?
export const orderedDriversCodec: Type<DriverWithOrder[]> = ioArray(
  ioIntersection([
    driverCodec,
    entityCodec,
    ioType({
      displayOrder: ioNumber
    })
  ])
);
