import { Entity } from './domain.definitions';

export type Driver = {
  identifier: string;
  username: string;
};

// TODO Is there a better way than having to put this in the domain ?
export type DriverWithOrder = Driver &
  Entity & {
    displayOrder: number;
  };
