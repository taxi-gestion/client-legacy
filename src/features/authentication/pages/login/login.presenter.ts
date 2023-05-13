import { INVALID_USERNAME_OR_PASSWORD_ERROR_NAME, UNKNOWN_ACCOUNT_ERROR_NAME, WRONG_PASSWORD_ERROR_NAME } from '../../errors';

export type FormattedLoginError = { field?: string; errors: Record<string, unknown> };

const loginErrorFormatMap: Map<string, (error: Error) => FormattedLoginError> = new Map([
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
    WRONG_PASSWORD_ERROR_NAME,
    (error: Error) => ({
      field: 'password',
      errors: {
        [WRONG_PASSWORD_ERROR_NAME]: error
      }
    })
  ],
  [
    INVALID_USERNAME_OR_PASSWORD_ERROR_NAME,
    (error: Error) => ({
      errors: {
        [INVALID_USERNAME_OR_PASSWORD_ERROR_NAME]: error
      }
    })
  ]
]);

export const formatLoginError = (error: Error): FormattedLoginError =>
  loginErrorFormatMap.get(error.name)?.(error) ?? { errors: { unknown: true } };
