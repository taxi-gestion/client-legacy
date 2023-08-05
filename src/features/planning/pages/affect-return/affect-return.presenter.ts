import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';
import { ReturnToAffectToScheduled } from '@domain';
import { ReturnToAffectPresentation } from '../../common';

export type FormattedAffectReturnError = { field?: string; errors: Record<string, unknown> };
export const formatAffectReturnError = (_error: Error): FormattedAffectReturnError => ({
  errors: { unknown: true }
});

export const toReturnToAffectToScheduled = (formValues: ReturnToAffectPresentation): ReturnToAffectToScheduled => ({
  id: formValues.returnToAffectId,
  departure: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  driver: formValues.driver,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  duration: formValues.driveDuration,
  distance: formValues.driveDistance,
  kind: 'two-way',
  status: 'affecting-return'
});
