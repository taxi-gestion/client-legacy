import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME, VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FaresSubcontracted, Subcontractor, ToSubcontract } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { FareToEditPresentation } from './edit-fare.form';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';

export const passengerFromContext = (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): string =>
  context.sessionContext.passenger;

export const toSubcontractFareSuccessToast = (fares: FaresSubcontracted): Toast => ({
  content: `Course pour ${fares.subcontracted.passenger} à ${toLocalTime(fares.subcontracted.datetime)} sous-traité à ${
    fares.subcontracted.subcontractor
  }`,
  status: 'success',
  title: 'Une course a été sous-traitée'
});

export const toFareToSubcontract = (
  subcontractFormValues: Subcontractor,
  editFareFormValues: FareToEditPresentation
): Entity & ToSubcontract => ({
  id: editFareFormValues.id,
  subcontractor: subcontractFormValues.subcontractor,
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