import {
  ACCOUNT_ALREADY_EXIST_ERROR_NAME,
  AccountAlreadyExistError,
  UNKNOWN_ACCOUNT_ERROR_NAME,
  UnknownAccountError
} from '../../../errors';
import { fieldErrorMessagesPresentation } from '../field-error-messages.presentation';
import { USERNAME_ERROR_MESSAGES, UsernameError } from './username.error-message';

describe('username error messages', (): void => {
  it('should not get any username error message', (): void => {
    const errors: UsernameError = null;

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, USERNAME_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual([]);
  });

  it('should get required username error message', (): void => {
    const errors: UsernameError = { required: true };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, USERNAME_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(['Saisissez votre adresse électronique ou numéro de téléphone portable']);
  });

  it('should get invalid username error message', (): void => {
    const errors: UsernameError = { invalidUsername: { username: '06213697' } };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, USERNAME_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(["06213697 n'est pas une adresse électronique ou un numéro de téléphone valide"]);
  });

  it('should get already exist username error message', (): void => {
    const errors: UsernameError = { [ACCOUNT_ALREADY_EXIST_ERROR_NAME]: new AccountAlreadyExistError('0621369798') };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, USERNAME_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(["Il existe déjà un compte associé à l'identifiant 0621369798"]);
  });

  it('should get unknown account error message', (): void => {
    const errors: UsernameError = { [UNKNOWN_ACCOUNT_ERROR_NAME]: new UnknownAccountError('0621369798') };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, USERNAME_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(["Il n'existe aucun compte associé à l'identifiant 0621369798"]);
  });
});
