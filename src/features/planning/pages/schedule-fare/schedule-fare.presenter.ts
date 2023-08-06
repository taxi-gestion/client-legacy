import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';
import { FareToSchedulePresentation } from './schedule-fare.form';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Journey, FareToSchedule } from '@domain';

export const toFareToSchedule = (formValues: FareToSchedulePresentation): FareToSchedule => ({
  //recurrence: formValues.recurrence,
  destination: formValues.arrivalPlace,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: formValues.departurePlace,
  distance: formValues.driveDistance,
  driver: formValues.driver,
  duration: formValues.driveDuration,
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: formValues.passenger,
  phone: formValues.phoneToCall,
  status: 'to-schedule'
});

export const toJourney = (formValues: FareToSchedulePresentation): Journey => ({
  origin: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  departureTime: datetimeLocalToIso8601UTCString(formValues.departureDatetime)
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
