import { Driver, Entity, Pending, Place } from '@definitions';
import { EstimateJourneyValues } from '../components';
import { defaultDriverValue } from './driver.presenter';

export type PendingPresentation = EstimateJourneyValues & {
  passenger: string;
  pendingReturnId: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driver: Driver & Entity;
};

export const toPendingReturnsForDatePresentation = (returnsToSchedule: (Entity & Pending)[]): PendingPresentation[] =>
  returnsToSchedule.map(toPendingForDatePresentation);

const toPendingForDatePresentation = (pendingReturn: Entity & Pending): PendingPresentation => ({
  passenger: pendingReturn.passenger,
  pendingReturnId: pendingReturn.id,
  departureDatetime: pendingReturn.datetime,
  departurePlace: pendingReturn.departure,
  arrivalPlace: pendingReturn.destination,
  driveDuration: 0,
  driveDistance: 0,
  driver: defaultDriverValue
});
