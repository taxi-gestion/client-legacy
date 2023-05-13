import {
  ACCOUNT_ALREADY_EXIST_ERROR_NAME,
  AccountAlreadyExistError,
  UNKNOWN_ACCOUNT_ERROR_NAME,
  UnknownAccountError
} from '../../../errors';

export type UsernameErrors = {
  required?: boolean;
  invalidUsername?: { value: string };
  accountAlreadyExistError?: AccountAlreadyExistError;
  unknownAccountError?: UnknownAccountError;
} | null;

export const USERNAME_ERROR_MESSAGES: Map<string, (errors: UsernameErrors) => string> = new Map([
  ['required', (): string => 'Saisissez votre adresse électronique ou numéro de téléphone portable'],
  [
    'invalidUsername',
    (usernameErrors: UsernameErrors): string =>
      `${usernameErrors?.invalidUsername?.value} n'est pas une adresse électronique ou un numéro de téléphone valide`
  ],
  [
    ACCOUNT_ALREADY_EXIST_ERROR_NAME,
    (usernameErrors: UsernameErrors): string =>
      `Il existe déjà un compte associé à l'identifiant ${usernameErrors?.accountAlreadyExistError?.username}`
  ],
  [
    UNKNOWN_ACCOUNT_ERROR_NAME,
    (usernameErrors: UsernameErrors): string =>
      `Il n'existe aucun compte associé à l'identifiant ${usernameErrors?.unknownAccountError?.username}`
  ]
]);
