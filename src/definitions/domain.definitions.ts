import { Place } from './place.definition';

export type Entity = { id: string };

export type Driver = {
  identifier: string;
  username: string;
};

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
  passenger: string;
  phone: string;
};

/*export type Regular = {
  firstname: string | undefined;
  lastname: string;
};*/

export type Civility = 'Child' | 'Company' | 'Couple' | 'Mr' | 'Mrs' | 'Other';

export type Phone = {
  type: string;
  // eslint-disable-next-line id-denylist
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

export type Fare = Drive & DurationDistance & Kind & Nature & { driver: Driver & Entity } & { passenger: Passenger };

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
  Nature &
  Passenger & {
    kind: 'two-way';
    status: 'pending-return';
  };

export type Subcontractor = {
  subcontractor: string;
};
// TODO Refactor Drive to exclude driver
export type ToSubcontract = Subcontractor & {
  status: 'to-subcontract';
};

// TODO Refactor Drive to exclude driver
export type Subcontracted = DurationDistance &
  Kind &
  Nature &
  Omit<Drive, 'driver'> &
  Passenger &
  Subcontractor & {
    status: 'subcontracted';
  };
