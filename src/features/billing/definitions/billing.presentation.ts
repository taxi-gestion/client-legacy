import { WaypointValues } from '../../common/waypoint';

export type BillingItemsByDriver = Record<string, BillingItem[]>;

export type BillingItem = {
  passenger: string;
  contactPhone: string;
  datetime: string;
  time: string;
  departure: WaypointValues;
  arrival: WaypointValues;
  distance: number;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  driver: string;
};
