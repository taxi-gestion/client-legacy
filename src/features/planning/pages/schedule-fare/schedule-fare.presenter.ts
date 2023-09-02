import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToSchedulePresentation } from './schedule-fare.form';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { FaresScheduled, ToSchedule } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';

export const toScheduleFareSuccessToast = (fares: FaresScheduled): Toast => ({
  content: `Course pour ${fares.scheduledCreated.passenger} par ${fares.scheduledCreated.driver} à ${toLocalTime(
    fares.scheduledCreated.datetime
  )} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToSchedule = (formValues: FareToSchedulePresentation): ToSchedule => ({
  //recurrence: formValues.recurrence,
  destination: formValues.arrivalPlace,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: formValues.departurePlace,
  distance: kilometersToMeters(formValues.driveDistance),
  driver: formValues.driver,
  duration: minutesToSeconds(formValues.driveDuration),
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: formValues.passenger,
  phone: formValues.phoneToCall,
  status: 'to-schedule'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedScheduleFareError = { field?: string; errors: Record<string, unknown> };
export const formatScheduleFareError = (error: Error): FormattedScheduleFareError =>
  scheduleFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const scheduleFareErrorFormatMap: Map<string, (error: Error) => FormattedScheduleFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedScheduleFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
