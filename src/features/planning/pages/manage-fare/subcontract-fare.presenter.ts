import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME, VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FaresSubcontracted, ToSubcontract } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { FareToEditValues } from './edit-fare.form';
import { toIdentity } from '@features/common/regular';

export const toSubcontractFareSuccessToast = (fares: FaresSubcontracted): Toast => ({
  content: `Course pour ${toIdentity(fares.subcontracted.passenger)} à ${toLocalTime(
    fares.subcontracted.datetime
  )} sous-traité à ${fares.subcontracted.subcontractor.identity}`,
  status: 'success',
  title: 'Une course a été sous-traitée'
});

export const toFareToSubcontract = (
  subcontractFormValues: { subcontractor: string },
  editFareFormValues: FareToEditValues
): Entity & ToSubcontract => ({
  id: editFareFormValues.id,
  subcontractor: {
    identity: subcontractFormValues.subcontractor
  },
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
