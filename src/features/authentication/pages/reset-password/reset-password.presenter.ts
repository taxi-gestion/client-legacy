import { INVALID_CODE_ERROR_NAME, LIMIT_EXCEEDED_ERROR_NAME, UNKNOWN_ACCOUNT_ERROR_NAME } from '../../errors';

export type FormattedResetPasswordError = { field?: string; errors: Record<string, unknown> };

const resetPasswordFormatMap: Map<string, (error: Error) => FormattedResetPasswordError> = new Map([
  [
    UNKNOWN_ACCOUNT_ERROR_NAME,
    (error: Error) => ({
      field: 'username',
      errors: {
        [UNKNOWN_ACCOUNT_ERROR_NAME]: error
      }
    })
  ],
  [
    INVALID_CODE_ERROR_NAME,
    (error: Error) => ({
      field: 'code',
      errors: {
        [INVALID_CODE_ERROR_NAME]: error
      }
    })
  ],
  [
    LIMIT_EXCEEDED_ERROR_NAME,
    (error: Error) => ({
      errors: {
        [LIMIT_EXCEEDED_ERROR_NAME]: error
      }
    })
  ]
]);

export const formatResetPasswordError = (error: Error): FormattedResetPasswordError =>
  resetPasswordFormatMap.get(error.name)?.(error) ?? { errors: { unknown: true } };
