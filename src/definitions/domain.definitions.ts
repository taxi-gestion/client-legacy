import { Place } from './place.definition';

export type Entity = { id: string };

export type EntityOrUndefined = { id: string | undefined };

export type Civility = 'Child' | 'Company' | 'Couple' | 'Mr' | 'Mrs' | 'Other';
export type Drive = {
  departure: Waypoint;
  arrival: Waypoint;
  datetime: string;
};

export type DurationDistance = {
  duration: number;
  distance: number;
};

export type Passenger = {
  firstname: string | undefined;
  lastname: string;
  civility: Civility;
  phone: {
    type: string;
    number: string;
  };
  comment: string | undefined;
};

export type Phone = {
  type: string;
  number: string;
};

export type Waypoint = {
  place: Place;
  name: string;
  comment: string | undefined;
} & { kind: Kind | undefined } & { nature: Nature | undefined };

export type Regular = {
  firstname: string | undefined;
  lastname: string;
  civility: Civility;
  phones: Phone[] | undefined;
  waypoints: Waypoint[] | undefined;
  comment: string | undefined;
  subcontractedClient: string | undefined;
};

export type Nature = 'medical' | 'standard';
export type Kind = 'one-way' | 'two-way';
