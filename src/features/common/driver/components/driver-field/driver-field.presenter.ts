import { Driver, Entity } from '@definitions';

export const filterOnDriverUsername = ([searchDriverTerm, drivers]: [string, (Driver & Entity)[]]): (Driver & Entity)[] =>
  drivers.filter((driver: Driver & Entity): boolean => driver.username.toLowerCase().includes(searchDriverTerm.toLowerCase()));
