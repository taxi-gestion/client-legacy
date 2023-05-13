import { INVALID_CODE_ERROR_NAME, InvalidCodeError, NoUsernameError, UnknownAccountError } from '../../errors';
import { activationCodeErrorMessageFrom, formatActivateError, FormattedActivateError } from './activate.presenter';

describe('activate presenter', (): void => {
  it('should format invalid code error', (): void => {
    const error: Error = new InvalidCodeError('73586');

    const formattedError: FormattedActivateError = formatActivateError(error);

    expect(formattedError).toStrictEqual({
      field: 'code',
      errors: {
        [INVALID_CODE_ERROR_NAME]: error
      }
    });
  });

  it('should format unknown error', (): void => {
    const error: Error = new Error();

    const formattedError: FormattedActivateError = formatActivateError(error);

    expect(formattedError).toStrictEqual({
      errors: {
        unknown: true
      }
    });
  });

  it('should format resend activation code unknown account error', (): void => {
    const error: Error = new UnknownAccountError('test@taxi-driver.com');

    const errorMessage: string = activationCodeErrorMessageFrom(error);

    expect(errorMessage).toStrictEqual("Il n'existe aucun compte associé à l'identifiant test@taxi-driver.com");
  });

  it('should format resend activation code invalid parameter error', (): void => {
    const error: Error = new NoUsernameError();

    const errorMessage: string = activationCodeErrorMessageFrom(error);

    expect(errorMessage).toStrictEqual("Saisissez l'email ou le numéro téléphone portable associé à votre compte");
  });

  it('should format resend activation code unknown error', (): void => {
    const error: Error = new Error();

    const errorMessage: string = activationCodeErrorMessageFrom(error);

    expect(errorMessage).toStrictEqual('Une erreur inconnue est survenue');
  });
});
