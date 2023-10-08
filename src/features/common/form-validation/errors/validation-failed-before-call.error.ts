export const VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME: string = 'validationFailedBeforeApiCallError';

export class ValidationFailedBeforeApiCallError extends Error {
  public override readonly name: string = VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME;
}
