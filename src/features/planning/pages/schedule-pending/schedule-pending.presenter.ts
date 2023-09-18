import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { Entity, PendingScheduled, ReturnDrive } from '@definitions';
import { PendingPresentation } from '../../common';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME } from '../../errors';
import { toLocalTime } from '../../common/fares.presenter';
import { max } from 'date-fns';

export const toSchedulePendingSuccessToast = (pending: PendingScheduled): Toast => ({
  content: `Course de retour pour ${pending.scheduledCreated.passenger.identity} par ${
    pending.scheduledCreated.driver.username
  } à ${toLocalTime(pending.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Un retour a été planifié'
});

export const toReturnToSchedule = (formValues: PendingPresentation): Entity & ReturnDrive => ({
  id: formValues.pendingReturnId,
  departure: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  driver: formValues.driver,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  distance: kilometersToMeters(formValues.driveDistance),
  duration: minutesToSeconds(formValues.driveDuration),
  status: 'return-drive'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedSchedulePendingError = { field?: string; errors: Record<string, unknown> };

export const formatSchedulePendingError = (error: Error): FormattedSchedulePendingError =>
  schedulePendingErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const schedulePendingErrorFormatMap: Map<string, (error: Error) => FormattedSchedulePendingError> = new Map([
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedSchedulePendingError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);

export const nowOrLater = (dayString: string): Date => {
  const now: Date = new Date();
  const later: Date = new Date(dayString);

  return max([now, later]);
};
