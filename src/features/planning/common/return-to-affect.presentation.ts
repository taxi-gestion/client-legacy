import { Entity, Place, ReturnToAffect } from '@domain';

export type ReturnToAffectPresentation = {
  returnToAffectId: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driveDuration: number;
  driveDistance: number;
  driver: string;
};

export const toReturnsToAffectForDatePresentation = (returnsToAffect: Entity<ReturnToAffect>[]): ReturnToAffectPresentation[] =>
  returnsToAffect.map(toReturnToAffectForDatePresentation);

const toReturnToAffectForDatePresentation = (returnToAffect: Entity<ReturnToAffect>): ReturnToAffectPresentation => ({
  returnToAffectId: returnToAffect.id,
  departureDatetime: returnToAffect.datetime,
  departurePlace: returnToAffect.departure,
  arrivalPlace: returnToAffect.destination,
  driveDuration: 0,
  driveDistance: 0,
  driver: returnToAffect.driver
});
