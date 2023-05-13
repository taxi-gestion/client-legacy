import { LIMIT_EXCEEDED_ERROR_NAME, LimitExceededError, UNKNOWN_ACCOUNT_ERROR_NAME, UnknownAccountError } from '../../errors';
import { formatForgotPasswordError, FormattedForgotPasswordError } from './forgot-password.presenter';

describe('forgot password presenter', (): void => {
  it('should format unknown account error', (): void => {
    const error: UnknownAccountError = new UnknownAccountError('0657893254');

    const formattedError: FormattedForgotPasswordError = formatForgotPasswordError(error);

    expect(formattedError).toStrictEqual({
      field: 'username',
      errors: {
        [UNKNOWN_ACCOUNT_ERROR_NAME]: error
      }
    });
  });

  it('should format too many attempts error', (): void => {
    const error: Error = new LimitExceededError();

    const formattedError: FormattedForgotPasswordError = formatForgotPasswordError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        [LIMIT_EXCEEDED_ERROR_NAME]: error
      }
    });
  });

  it('should format unknown error', (): void => {
    const error: Error = new Error();

    const formattedError: FormattedForgotPasswordError = formatForgotPasswordError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        unknown: true
      }
    });
  });
});
