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
  firstname: string;
  lastname: string;
};

export type Civility = 'Mr' | 'Mrs';

export type Phone = {
  name: string;
  // eslint-disable-next-line id-denylist
  number: string;
};

export type RegularDetails = Regular & {
  civility: Civility;
  phones: Phone[] | undefined;
  home: Place | undefined;
  destinations: Place[] | undefined;
  commentary: string | undefined;
  subcontractedClient: string | undefined;
};

export type Nature = {
  nature: 'medical' | 'standard';
};

export type ToSchedule = Drive &
  DurationDistance &
  Nature &
  Passenger & {
    kind: 'one-way' | 'two-way';
    status: 'to-schedule';
  };

export type ToEdit = Drive &
  DurationDistance &
  Nature &
  Passenger & {
    kind: 'one-way' | 'two-way';
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
  Nature &
  Passenger & {
    kind: 'one-way' | 'two-way';
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
  Nature &
  Omit<Drive, 'driver'> &
  Passenger &
  Subcontractor & {
    kind: 'one-way' | 'two-way';
    status: 'subcontracted';
  };
