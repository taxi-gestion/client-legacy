import { Place } from './place.definition';
export type Entity = { id: string };
export type ReturnToDelete = { idToDelete: string };

export type Drive = {
  departure: Place;
  destination: Place;
  datetime: string;
  driver: string;
};

export type DurationDistance = {
  duration: number;
  distance: number;
};

export type Passenger = {
  passenger: string;
  phone: string;
};

export type Nature = {
  nature: 'medical' | 'standard';
};

export type FareToSchedule = Drive &
  DurationDistance &
  Nature &
  Passenger & {
    kind: 'one-way' | 'two-way';
    status: 'to-schedule';
  };

export type ReturnToSchedule = Drive &
  DurationDistance & {
    kind: 'two-way';
    status: 'return-to-schedule';
  };

export type CompletedReturnToSchedule = Nature & Passenger & ReturnToSchedule;

export type Pending = Drive &
  Nature &
  Passenger & {
    kind: 'two-way';
    status: 'pending-return';
  };

export type Scheduled = Drive &
  DurationDistance &
  Nature &
  Passenger & {
    kind: 'one-way' | 'two-way';
    status: 'scheduled';
  };
