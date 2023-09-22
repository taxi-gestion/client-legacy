import { Entity, Fare } from '@definitions';

export type ScheduledFareValues = Entity &
  Fare & {
    status: 'scheduled';
  };
