import { DriverValues } from '@features/common/driver';
import { Civility, Entity } from '@definitions';
import { PhoneValues } from '@features/common/phone';

import { WaypointValues } from '@features/common/waypoint';

export type ScheduledFareValues = {
  datetime: string;
  departure: WaypointValues;
  arrival: WaypointValues;
  distance: number;
  driver: DriverValues;
  duration: number;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'scheduled';
  creator: 'manager' | 'recurrence';
};

export type UnassignedFareValues = {
  datetime: string;
  departure: WaypointValues;
  arrival: WaypointValues;
  distance: number;
  duration: number;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'unassigned';
};

export type RecurringFareValues = {
  time: string;
  departure: WaypointValues;
  arrival: WaypointValues;
  distance: number;
  driver: DriverValues | undefined;
  duration: number;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'recurring';
};

export type PassengerValues = Entity & {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  phone: PhoneValues;
  comment: string | undefined;
};

export type PendingReturnValues = {
  datetime: string;
  departure: WaypointValues;
  arrival: WaypointValues;
  driver: DriverValues;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'pending-return';
};
