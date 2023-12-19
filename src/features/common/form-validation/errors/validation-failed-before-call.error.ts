export const VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME: string = 'validationFailedBeforeApiCallError';

export class ValidationFailedBeforeApiCall extends Error {
  public override readonly name: string = VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME;
}
