export const VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME: string = 'validationFailedAfterApiCallError';

export class ValidationFailedOnApiResult extends Error {
  public override readonly name: string = VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME;
}
