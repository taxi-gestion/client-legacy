import { Pending, Regular, RegularDetails, Scheduled, Subcontracted } from './index';

export type ScheduledPersistence = Scheduled;

export type SubcontractedPersistence = Subcontracted;

export type PendingPersistence = Pending & {
  outwardFareId: string;
};

export type RegularPersistence = Regular;

export type RegularDetailsPersistence = Omit<RegularDetails, 'subcontractedClient'> & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  subcontracted_client: string | undefined;
};
