export type BillingItemsByDriver = Record<string, BillingItem[]>;

export type BillingItem = {
  passenger: string;
  datetime: string;
  time: string;
  departure: string;
  arrival: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  driver: string;
};
