import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME, VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FareToSubcontract, Subcontracted, Subcontractor } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToEditPresentation } from './edit-fare.form';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';

export const passengerFromContext = (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): string =>
  context.sessionContext.passenger;

export const toSubcontractFareSuccessToast = (payload: { rows: (Entity & Subcontracted)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fare: Entity & Subcontracted = payload[0]!.rows[0]!;
  return {
    content: `Course pour ${fare.passenger} à ${toLocalTime(fare.datetime)} sous-traité à ${fare.subcontractor}`,
    status: 'success',
    title: 'Une course a été sous-traitée'
  };
};

export const toFareToSubcontract = (
  subcontractFormValues: Subcontractor,
  editFareFormValues: FareToEditPresentation
): Entity & FareToSubcontract => ({
  id: editFareFormValues.id,
  destination: editFareFormValues.arrivalPlace,
  datetime: datetimeLocalToIso8601UTCString(editFareFormValues.departureDatetime),
  departure: editFareFormValues.departurePlace,
  distance: kilometersToMeters(editFareFormValues.driveDistance),
  subcontractor: subcontractFormValues.subcontractor,
  duration: minutesToSeconds(editFareFormValues.driveDuration),
  kind: editFareFormValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: editFareFormValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: editFareFormValues.passenger,
  phone: editFareFormValues.phoneToCall,
  status: 'to-subcontract'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedSubcontractFareError = { field?: string; errors: Record<string, unknown> };
export const formatSubcontractFareError = (error: Error): FormattedSubcontractFareError =>
  subcontractFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const subcontractFareErrorFormatMap: Map<string, (error: Error) => FormattedSubcontractFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedSubcontractFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ],
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedSubcontractFareError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
