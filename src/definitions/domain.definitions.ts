import { Place } from './place.definition';
import { Driver } from './drivers.definitions';

export type Entity = { id: string };

export type Drive = {
  departure: Place;
  destination: Place;
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
};

export type Civility = 'Child' | 'Company' | 'Couple' | 'Mr' | 'Mrs' | 'Other';

export type Phone = {
  type: string;
  number: string;
};

export type Destination = Kind &
  Nature & {
    place: Place;
    name: string;
    comment: string | undefined;
  };

export type RegularDetails = {
  firstname: string | undefined;
  lastname: string;
  civility: Civility;
  phones: Phone[] | undefined;
  home: Place | undefined;
  destinations: Destination[] | undefined;
  commentary: string | undefined;
  subcontractedClient: string | undefined;
};

export type Nature = {
  nature: 'medical' | 'standard';
};

export type Kind = {
  kind: 'one-way' | 'two-way';
};

export type Fare = Drive & DurationDistance & Kind & Nature & { driver: Driver & Entity } & { passenger: Entity & Passenger };

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
  Nature & {
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
  Kind &
  Nature & {
    status: 'subcontracted';
  } & { passenger: Entity & Passenger } & { subcontractor: Subcontractor };
