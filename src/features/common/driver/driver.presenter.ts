import { DriverValues } from './definitions/driver.definition';
import { Driver, DriverWithOrder, Entity } from '@definitions';

import { contramap, Ord } from 'fp-ts/Ord';
import { Ord as ordNumber } from 'fp-ts/number';
import { sort } from 'fp-ts/Array';

const byDisplayOrder: Ord<DriverWithOrder> = contramap((driver: DriverWithOrder): number => driver.displayOrder)(ordNumber);

export const sortDriversByDisplayOrder = (drivers: DriverWithOrder[]): DriverWithOrder[] => sort(byDisplayOrder)(drivers);

export const driverEmptyValue: DriverValues = {
  id: '',
  identifier: '',
  username: ''
};

export const toDriver = (driverValue: DriverValues): Driver & Entity => ({
  ...driverValue
});

export const toDriverValues = (driver: Driver & Entity): DriverValues => ({
  ...driver
});

export const toDriversValues = (
  drivers: (Driver & Entity)[] | DriverValues | DriverValues[] | (Driver & Entity) | undefined
): DriverValues[] => {
  if (drivers === undefined) return [];

  return 'id' in drivers ? [drivers] : drivers;
};
