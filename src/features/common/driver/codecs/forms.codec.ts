import { Type } from 'io-ts';
import { DriverValues } from '../definitions';
import { driverEntityCodec } from '../../../../codecs/domain/driver.codecs';

export const driverValuesCodec: Type<DriverValues> = driverEntityCodec;
