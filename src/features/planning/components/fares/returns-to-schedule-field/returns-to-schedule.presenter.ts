import { PendingReturnToSchedule } from '@domain';
import { ReturnToSchedulePresentation } from '../../../common';

export type ReturnToScheduleWithPassengerPresentation = ReturnToSchedulePresentation & {
  passenger: string;
};
export const toReturnsToScheduleWithPassengerForDatePresentation = (
  returnsToSchedule: PendingReturnToSchedule[]
): ReturnToScheduleWithPassengerPresentation[] => returnsToSchedule.map(toReturnToScheduleWithPassengerForDatePresentation);

export const toReturnToScheduleWithPassengerForDatePresentation = (
  returnToSchedule: PendingReturnToSchedule
): ReturnToScheduleWithPassengerPresentation => ({
  passenger: returnToSchedule.passenger,
  returnToScheduleId: returnToSchedule.id,
  departureDatetime: returnToSchedule.datetime,
  departurePlace: returnToSchedule.departure,
  arrivalPlace: returnToSchedule.destination,
  driveDuration: 0,
  driveDistance: 0,
  driver: returnToSchedule.driver
});
