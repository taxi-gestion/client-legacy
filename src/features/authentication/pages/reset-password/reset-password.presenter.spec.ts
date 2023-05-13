import {
  INVALID_CODE_ERROR_NAME,
  InvalidCodeError,
  LIMIT_EXCEEDED_ERROR_NAME,
  LimitExceededError,
  UNKNOWN_ACCOUNT_ERROR_NAME,
  UnknownAccountError
} from '../../errors';
import { formatResetPasswordError, FormattedResetPasswordError } from './reset-password.presenter';

describe('reset password presenter', (): void => {
  it('should format unknown account error', (): void => {
    const error: UnknownAccountError = new UnknownAccountError('0657893254');

    const formattedError: FormattedResetPasswordError = formatResetPasswordError(error);

    expect(formattedError).toStrictEqual({
      field: 'username',
      errors: {
        [UNKNOWN_ACCOUNT_ERROR_NAME]: error
      }
    });
  });

  it('should format expired code error', (): void => {
    const error: Error = new InvalidCodeError('73586');

    const formattedError: FormattedResetPasswordError = formatResetPasswordError(error);

    expect(formattedError).toStrictEqual({
      field: 'code',
      errors: {
        [INVALID_CODE_ERROR_NAME]: error
      }
    });
  });

  it('should format too many attempts error', (): void => {
    const error: Error = new LimitExceededError();

    const formattedError: FormattedResetPasswordError = formatResetPasswordError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        [LIMIT_EXCEEDED_ERROR_NAME]: error
      }
    });
  });

  it('should format unknown error', (): void => {
    const error: Error = new Error();

    const formattedError: FormattedResetPasswordError = formatResetPasswordError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        unknown: true
      }
    });
  });
});
