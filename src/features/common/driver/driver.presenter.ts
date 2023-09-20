import { DriverValues } from './definitions/driver.definition';
import { Driver, Entity } from '@definitions';

export const driverEmptyValue: DriverValues = {
  id: '',
  identifier: '',
  username: ''
};

export const toDriver = (driverValue: DriverValues): Driver & Entity => ({
  ...driverValue
});

export const toDriversValues = (
  drivers: (Driver & Entity)[] | DriverValues | DriverValues[] | (Driver & Entity) | undefined
): DriverValues[] => {
  if (drivers === undefined) return [];

  return 'id' in drivers ? [drivers] : drivers;
};
