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

export type Regular = {
  firstname: string | undefined;
  lastname: string;
};

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

export type RegularDetails = Regular & {
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

export type ToSchedule = Drive &
  DurationDistance &
  Kind &
  Nature &
  Passenger & {
    status: 'to-schedule';
  };

export type ToEdit = Drive &
  DurationDistance &
  Kind &
  Nature &
  Passenger & {
    status: 'to-edit';
  };

export type ReturnDrive = Drive &
  DurationDistance & {
    status: 'return-drive';
  };

export type Pending = Drive &
  Nature &
  Passenger & {
    kind: 'two-way';
    status: 'pending-return';
  };

export type Scheduled = Drive &
  DurationDistance &
  Kind &
  Nature &
  Passenger & {
    status: 'scheduled';
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
