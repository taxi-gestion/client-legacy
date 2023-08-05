import { PendingReturnToSchedule, Place } from '@domain';

export type ReturnToSchedulePresentation = {
  returnToScheduleId: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driveDuration: number;
  driveDistance: number;
  driver: string;
};

export const toReturnsToScheduleForDatePresentation = (
  returnsToSchedule: PendingReturnToSchedule[]
): ReturnToSchedulePresentation[] => returnsToSchedule.map(toReturnToScheduleForDatePresentation);

const toReturnToScheduleForDatePresentation = (returnToSchedule: PendingReturnToSchedule): ReturnToSchedulePresentation => ({
  returnToScheduleId: returnToSchedule.id,
  departureDatetime: returnToSchedule.datetime,
  departurePlace: returnToSchedule.departure,
  arrivalPlace: returnToSchedule.destination,
  driveDuration: 0,
  driveDistance: 0,
  driver: returnToSchedule.driver
});
