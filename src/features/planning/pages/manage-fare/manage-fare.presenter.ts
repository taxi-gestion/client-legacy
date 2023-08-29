import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, Pending, Scheduled } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../schedule-fare/schedule-fare.presenter';

export const toDeleteFareSuccessToast = (payload: [Entity & Scheduled, (Entity & Pending)?]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const content: string =
    payload[1] === undefined
      ? `Course pour ${payload[0].passenger} par ${payload[0].driver} à ${toLocalTime(payload[0].datetime)} supprimée`
      : `Course et Retour pour ${payload[0].passenger} par ${payload[0].driver} à ${toLocalTime(
          payload[0].datetime
        )} supprimés`;

  const title: string = payload[1] === undefined ? 'Une course a été supprimée' : 'Une course et son retour on étés supprimés';

  return {
    content,
    status: 'success',
    title
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
