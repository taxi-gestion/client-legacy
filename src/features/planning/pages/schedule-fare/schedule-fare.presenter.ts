import {
  datetimeLocalToIso8601UTCString,
  formatDateToDatetimeLocalString,
  kilometersToMeters,
  minutesToSeconds
} from '../../common/unit-convertion';
import { FareToSchedulePresentation } from './schedule-fare.form';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Journey, FareToSchedule, Entity, Scheduled } from '@domain';
import { addMinutes, format, subHours } from 'date-fns';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';

export const toLocalDatetimeString = (dateString: string, timeInMinutes: number): string =>
  formatDateToDatetimeLocalString(subHours(addMinutes(new Date(dateString), timeInMinutes), 2));

export const toLocalTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const toScheduleFareSuccessToast = (payload: { rows: (Entity & Scheduled)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fare: Entity & Scheduled = payload[0]!.rows[0]!;
  return {
    content: `Course pour ${fare.passenger} par ${fare.driver} à ${toLocalTime(fare.datetime)} ajoutée`,
    status: 'success',
    title: 'Course ajoutée avec succès'
  };
};

export const toFareToSchedule = (formValues: FareToSchedulePresentation): FareToSchedule => ({
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
