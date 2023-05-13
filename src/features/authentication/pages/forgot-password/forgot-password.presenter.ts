import { LIMIT_EXCEEDED_ERROR_NAME, UNKNOWN_ACCOUNT_ERROR_NAME } from '../../errors';

export type FormattedForgotPasswordError = { field?: string; errors: Record<string, unknown> };

const forgotPasswordFormatMap: Map<string, (error: Error) => FormattedForgotPasswordError> = new Map([
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
    LIMIT_EXCEEDED_ERROR_NAME,
    (error: Error) => ({
      errors: {
        [LIMIT_EXCEEDED_ERROR_NAME]: error
      }
    })
  ]
]);

export const formatForgotPasswordError = (error: Error): FormattedForgotPasswordError =>
  forgotPasswordFormatMap.get(error.name)?.(error) ?? { errors: { unknown: true } };
