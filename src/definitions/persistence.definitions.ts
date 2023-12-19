/* eslint-disable @typescript-eslint/naming-convention */
import { Entity, Pending, Recurring, Regular, Scheduled, Subcontracted, Unassigned } from './index';

export type DriverPersistence = {
  id: string;
  username: string;
  identifier: string;
  display_order: number;
};

export type ScheduledPersistence = Omit<Scheduled, 'datetime' | 'status'> & {
  datetime: Date;
};

export type UnassignedPersistence = Omit<Unassigned, 'datetime' | 'status'> & {
  datetime: Date;
};

export type SubcontractedPersistence = Omit<Subcontracted, 'datetime' | 'status'> & {
  datetime: Date;
};

export type PendingPersistence = Omit<Pending, 'datetime' | 'status'> & {
  datetime: Date;
} & {
  outwardFareId: string;
};

export type RecurringPersistence = Omit<Recurring, 'departureTime' | 'returnTime' | 'status'> & {
  departure_time: string;
  return_time: string | undefined;
};

export type RegularPersistence = Omit<Regular, 'subcontractedClient'> & {
  subcontracted_client: string | undefined;
};

export type FaresCountForDatePersistence = { scheduled: string; pending: string; subcontracted: string; unassigned: string };

export type RegularHistoryPersistence = {
  scheduled: (Entity & ScheduledPersistence)[];
  pending: (Entity & PendingPersistence)[];
  subcontracted: (Entity & SubcontractedPersistence)[];
  unassigned: (Entity & UnassignedPersistence)[];
};
