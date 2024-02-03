import { Driver } from './drivers.definitions';
import { Drive, DurationDistance, Entity, Kind, Nature, Passenger, Waypoint } from './domain.definitions';

/** transformations
 * ToScheduled => Scheduled & Pending?
 * ToScheduledEdited => Scheduled & Pending?
 * UnassignedToScheduled => Scheduled & Pending?
 * PendingToScheduled => Scheduled
 *
 * ToUnassigned => Unassigned
 *
 * Scheduled => Subcontracted
 * Pending => Subcontracted
 * Unassigned => Subcontracted
 * */

type FareTransformStatus =
  | 'pending-to-scheduled'
  | 'to-recurring'
  | 'to-scheduled-edited'
  | 'to-scheduled'
  | 'to-subcontracted'
  | 'to-unassigned';

export type FareStableStatus = 'pending' | 'recurring' | 'scheduled' | 'subcontracted' | 'unassigned';

type WithStatus<T extends FareStableStatus | FareTransformStatus> = {
  status: T;
};

// Scheduled
export type Scheduled = FareReady & WithStatus<'scheduled'>;

type FareReady = Drive & DurationDistance & WithCreator & WithDriver & WithKind & WithNature & WithPassenger;
export type PendingToScheduled = Drive & DurationDistance & WithCreator & WithDriver & WithStatus<'pending-to-scheduled'>;
export type ToScheduled = FareReady & WithStatus<'to-scheduled'>;
export type ToScheduledEdited = FareReady & WithStatus<'to-scheduled-edited'>;

// Unassigned
export type Unassigned = Drive &
  DurationDistance &
  WithCreator &
  WithKind &
  WithNature &
  WithPassenger &
  WithStatus<'unassigned'>;

export type ToUnassigned = Drive &
  DurationDistance &
  WithCreator &
  WithKind &
  WithNature &
  WithPassenger &
  WithStatus<'to-unassigned'>;

// Pending
export type Pending = Drive &
  WithCreator &
  WithNature &
  WithOptionalDriver &
  WithPassenger &
  WithStatus<'pending'> &
  WithTwoWay;

// Subcontracted
export type Subcontracted = Drive & WithKind & WithNature & WithPassenger & WithStatus<'subcontracted'> & WithSubcontractor;

export type ToSubcontracted = WithStatus<'to-subcontracted'> & WithSubcontractor;

export type Subcontractor = {
  identity: string;
};

// Recurring
type FareRecurring = DurationDistance &
  WithKind &
  WithNature &
  WithOptionalDriver &
  WithPassenger & {
    departure: Waypoint;
    arrival: Waypoint;
    departureTime: string;
    returnTime: string | undefined;
    recurrence: string;
  };
export type Recurring = FareRecurring & WithStatus<'recurring'>;
export type ToRecurring = FareRecurring & WithStatus<'to-recurring'>;

export type FaresCount = {
  scheduled: number;
  pending: number;
  subcontracted: number;
  unassigned: number;
};

type WithDriver = { driver: Driver & Entity };
type WithOptionalDriver = { driver: (Driver & Entity) | undefined };
type WithPassenger = { passenger: Entity & Passenger };
type WithSubcontractor = { subcontractor: Subcontractor };
export type WithNature = { nature: Nature };
export type WithKind = { kind: Kind };
type WithTwoWay = { kind: 'two-way' };
type WithCreator = { creator: 'manager' | 'recurrence' };
