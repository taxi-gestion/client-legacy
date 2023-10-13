import { Place } from './place.definition';
import { Driver } from './drivers.definitions';

export type Entity = { id: string };

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

export type Civility = 'Child' | 'Company' | 'Couple' | 'Mr' | 'Mrs' | 'Other';

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

export type WithNature = {
  nature: Nature;
};

export type WithKind = {
  kind: Kind;
};

export type Fare = Drive &
  DurationDistance &
  WithKind &
  WithNature & { driver: Driver & Entity } & { passenger: Entity & Passenger };

export type ToSchedule = Fare & {
  status: 'to-schedule';
};

export type ToEdit = Fare & {
  status: 'to-edit';
};

export type Scheduled = Fare & {
  status: 'scheduled';
};

export type ReturnDrive = Drive &
  DurationDistance & {
    status: 'return-drive';
  } & { driver: Driver & Entity };

export type Pending = Drive &
  WithNature & {
    kind: 'two-way';
    status: 'pending-return';
  } & { driver: Driver & Entity } & { passenger: Entity & Passenger };

export type Subcontractor = {
  identity: string;
};

export type ToSubcontract = {
  status: 'to-subcontract';
} & { subcontractor: Subcontractor };

export type Subcontracted = Drive &
  DurationDistance &
  WithKind &
  WithNature & {
    status: 'subcontracted';
  } & { passenger: Entity & Passenger } & { subcontractor: Subcontractor };
