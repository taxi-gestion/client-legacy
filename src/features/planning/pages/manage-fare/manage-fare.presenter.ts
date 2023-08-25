import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';

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
