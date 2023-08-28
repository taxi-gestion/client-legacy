import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, Scheduled } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../schedule-fare/schedule-fare.presenter';

export const toDeleteFareSuccessToast = (payload: { rows: (Entity & Scheduled)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fare: Entity & Scheduled = payload[0]!.rows[0]!;
  return {
    content: `Course pour ${fare.passenger} par ${fare.driver} à ${toLocalTime(fare.datetime)} supprimée`,
    status: 'success',
    title: 'Une course a été supprimée'
  };
};

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedManageFareError = { field?: string; errors: Record<string, unknown> };
export const formatManageFareError = (error: Error): FormattedManageFareError =>
  manageFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const manageFareErrorFormatMap: Map<string, (error: Error) => FormattedManageFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedManageFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
