import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME, VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FareToEdit, Scheduled } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToEditPresentation } from './edit-fare.form';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';

export const passengerFromContext = (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): string =>
  context.sessionContext.passenger;

export const toEditFareSuccessToast = (payload: { rows: (Entity & Scheduled)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fare: Entity & Scheduled = payload[0]!.rows[0]!;
  return {
    content: `Course pour ${fare.passenger} par ${fare.driver} à ${toLocalTime(fare.datetime)} planifiée`,
    status: 'success',
    title: 'Une course a été planifiée'
  };
};

export const toFareToEdit = (formValues: FareToEditPresentation): Entity & FareToEdit => ({
  id: formValues.id,
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
  status: 'to-edit'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedEditFareError = { field?: string; errors: Record<string, unknown> };
export const formatEditFareError = (error: Error): FormattedEditFareError =>
  editFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const editFareErrorFormatMap: Map<string, (error: Error) => FormattedEditFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedEditFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ],
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedEditFareError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
