import {
  ACCOUNT_ALREADY_EXIST_ERROR_NAME,
  AccountAlreadyExistError,
  UNKNOWN_ACCOUNT_ERROR_NAME,
  UnknownAccountError
} from '../../../errors';

export type UsernameError = {
  required?: boolean;
  invalidUsername?: { username: string };
  accountAlreadyExistError?: AccountAlreadyExistError;
  unknownAccountError?: UnknownAccountError;
} | null;

export const USERNAME_ERROR_MESSAGES: Map<string, (errors: UsernameError) => string> = new Map([
  ['required', (): string => 'Saisissez votre adresse électronique ou numéro de téléphone portable'],
  [
    'invalidUsername',
    (usernameError: UsernameError): string =>
      `${usernameError?.invalidUsername?.username} n'est pas une adresse électronique ou un numéro de téléphone valide`
  ],
  [
    ACCOUNT_ALREADY_EXIST_ERROR_NAME,
    (usernameError: UsernameError): string =>
      `Il existe déjà un compte associé à l'identifiant ${usernameError?.accountAlreadyExistError?.username}`
  ],
  [
    UNKNOWN_ACCOUNT_ERROR_NAME,
    (usernameError: UsernameError): string =>
      `Il n'existe aucun compte associé à l'identifiant ${usernameError?.unknownAccountError?.username}`
  ]
]);
