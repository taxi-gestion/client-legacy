import { Place } from './place.definition';
import { Entity } from './entity.definition';

export type Fare = {
  passenger: string;
  departure: Place;
  destination: Place;
  datetime: string;
  phone: string;
  kind: 'one-way' | 'two-way';
  nature: 'medical' | 'standard';
  driver: string;
};

export type ToSchedule = Fare & {
  status: 'to-schedule';
  duration: number;
  distance: number;
};

export type Scheduled = Fare & {
  status: 'scheduled';
  creator: string;
  duration: number;
  distance: number;
};

export type PendingReturnToSchedule = Entity<
  Fare & {
    kind: 'two-way';
    status: 'pending-return-to-schedule';
  }
>;

export type ReturnToSchedule = Entity<{
  departure: Place;
  destination: Place;
  driver: string;
  datetime: string;
  duration: number;
  distance: number;
  kind: 'two-way';
  status: 'return-to-schedule';
}>;
