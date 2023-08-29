import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { Entity, ReturnToSchedule, Scheduled } from '@domain';
import { PendingPresentation } from '../../common';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../schedule-fare/schedule-fare.presenter';
import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME } from '../../errors';

export const toScheduleReturnSuccessToast = (payload: { rows: (Entity & Scheduled)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fare: Entity & Scheduled = payload[0]!.rows[0]!;
  return {
    content: `Retour pour ${fare.passenger} par ${fare.driver} à ${toLocalTime(fare.datetime)} planifié`,
    status: 'success',
    title: 'Un retour a été planifié'
  };
};

export const toReturnToSchedule = (formValues: PendingPresentation): Entity & ReturnToSchedule => ({
  id: formValues.pendingReturnId,
  departure: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  driver: formValues.driver,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  distance: kilometersToMeters(formValues.driveDistance),
  duration: minutesToSeconds(formValues.driveDuration),
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
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedScheduleReturnError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
