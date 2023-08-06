import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';
import { Entity, ReturnToSchedule } from '@domain';
import { PendingPresentation } from '../../common';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';

export const toReturnToSchedule = (formValues: PendingPresentation): Entity & ReturnToSchedule => ({
  id: formValues.pendingReturnId,
  departure: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  driver: formValues.driver,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  duration: formValues.driveDuration,
  distance: formValues.driveDistance,
  kind: 'two-way',
  status: 'return-to-schedule'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedScheduleReturnError = { field?: string; errors: Record<string, unknown> };

export const formatScheduleReturnError = (error: Error): FormattedScheduleReturnError =>
  scheduleReturnErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const scheduleReturnErrorFormatMap: Map<string, (error: Error) => FormattedScheduleReturnError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedScheduleReturnError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
