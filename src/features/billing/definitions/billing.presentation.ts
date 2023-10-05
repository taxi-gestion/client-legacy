import { Nature } from '@definitions';

export type BillingItemsByNature = Record<Nature['nature'], BillingItem[]>;

export type BillingItemsByDriver = Record<string, BillingItem[]>;

export type BillingItem = {
  passenger: string;
  time: string;
  departure: string;
  destination: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  driver: string;
};
