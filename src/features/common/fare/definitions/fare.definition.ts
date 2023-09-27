import { PlaceValues } from '@features/common/place';
import { DriverValues } from '@features/common/driver';
import { Civility, Entity } from '@definitions';
import { PhoneValues } from '@features/common/phone';

export type ScheduledFareValues = {
  datetime: string;
  departure: PlaceValues;
  destination: PlaceValues;
  distance: number;
  driver: DriverValues;
  duration: number;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'scheduled';
};

export type PassengerValues = Entity & {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  phone: PhoneValues;
};

export type PendingReturnValues = {
  datetime: string;
  departure: PlaceValues;
  destination: PlaceValues;
  driver: DriverValues;
  id: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  passenger: PassengerValues;
  status: 'pending-return';
};
