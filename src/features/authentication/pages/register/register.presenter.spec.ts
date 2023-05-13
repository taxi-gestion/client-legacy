import { ACCOUNT_ALREADY_EXIST_ERROR_NAME, AccountAlreadyExistError } from '../../errors';
import { formatRegisterError, FormattedRegisterError } from './register.presenter';

describe('register presenter', (): void => {
  it('should format account already exist error', (): void => {
    const error: AccountAlreadyExistError = new AccountAlreadyExistError('0657893254');

    const formattedError: FormattedRegisterError = formatRegisterError(error);

    expect(formattedError).toStrictEqual({
      field: 'username',
      errors: {
        [ACCOUNT_ALREADY_EXIST_ERROR_NAME]: error
      }
    });
  });

  it('should format unknown error', (): void => {
    const error: Error = new Error();

    const formattedError: FormattedRegisterError = formatRegisterError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        unknown: true
      }
    });
  });
});
