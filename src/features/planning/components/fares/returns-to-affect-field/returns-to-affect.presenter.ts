import { Entity, ReturnToAffect } from '@domain';
import { ReturnToAffectPresentation } from '../../../common';

export type ReturnToAffectWithPassengerPresentation = ReturnToAffectPresentation & {
  passenger: string;
};
export const toReturnsToAffectWithPassengerForDatePresentation = (
  returnsToAffect: Entity<ReturnToAffect>[]
): ReturnToAffectWithPassengerPresentation[] => returnsToAffect.map(toReturnToAffectWithPassengerForDatePresentation);

export const toReturnToAffectWithPassengerForDatePresentation = (
  returnToAffect: Entity<ReturnToAffect>
): ReturnToAffectWithPassengerPresentation => ({
  passenger: returnToAffect.passenger,
  returnToAffectId: returnToAffect.id,
  departureDatetime: returnToAffect.datetime,
  departurePlace: returnToAffect.departure,
  arrivalPlace: returnToAffect.destination,
  driveDuration: 0,
  driveDistance: 0,
  driver: returnToAffect.driver
});
