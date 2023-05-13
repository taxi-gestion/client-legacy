import {
  INVALID_USERNAME_OR_PASSWORD_ERROR_NAME,
  InvalidUsernameOrPasswordError,
  UNKNOWN_ACCOUNT_ERROR_NAME,
  UnknownAccountError,
  WRONG_PASSWORD_ERROR_NAME,
  WrongPasswordError
} from '../../errors';
import { formatLoginError, FormattedLoginError } from './login.presenter';

describe('login presenter', (): void => {
  it('should format unknown account error', (): void => {
    const error: UnknownAccountError = new UnknownAccountError('0657893254');

    const formattedError: FormattedLoginError = formatLoginError(error);

    expect(formattedError).toStrictEqual({
      field: 'username',
      errors: {
        [UNKNOWN_ACCOUNT_ERROR_NAME]: error
      }
    });
  });

  it('should format wrong password error', (): void => {
    const error: WrongPasswordError = new WrongPasswordError('0657893254');

    const formattedError: FormattedLoginError = formatLoginError(error);

    expect(formattedError).toStrictEqual({
      field: 'password',
      errors: {
        [WRONG_PASSWORD_ERROR_NAME]: error
      }
    });
  });

  it('should format invalid account or password error', (): void => {
    const error: InvalidUsernameOrPasswordError = new InvalidUsernameOrPasswordError();

    const formattedError: FormattedLoginError = formatLoginError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        [INVALID_USERNAME_OR_PASSWORD_ERROR_NAME]: error
      }
    });
  });

  it('should format unknown error', (): void => {
    const error: Error = new Error();

    const formattedError: FormattedLoginError = formatLoginError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        unknown: true
      }
    });
  });
});
