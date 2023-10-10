/* eslint-disable @typescript-eslint/naming-convention */
import { Pending, RegularDetails, Scheduled, Subcontracted } from './index';

export type DriverPersistence = {
  id: string;
  username: string;
  identifier: string;
  display_order: number;
};

export type ScheduledPersistence = Scheduled;

export type SubcontractedPersistence = Subcontracted;

export type PendingPersistence = Pending & {
  outwardFareId: string;
};

export type RegularDetailsPersistence = Omit<RegularDetails, 'subcontractedClient'> & {
  subcontracted_client: string | undefined;
};
