import { WRONG_PASSWORD_ERROR_NAME } from '../../../errors';

export type PasswordError = {
  required?: boolean;
  minlength?: {
    requiredLength: number;
    actualLength: number;
  };
  missingSpecialChar?: object;
  missingNumber?: object;
  missingUppercaseChar?: object;
  missingLowercaseChar?: object;
  forbiddenLeadingSpace?: object;
  forbiddenTrailingSpace?: object;
  wrongPasswordError?: { username: string };
} | null;

export const PASSWORD_ERROR_MESSAGES: Map<string, (errors: PasswordError) => string> = new Map([
  ['required', (): string => 'Saisissez le mot de passe de votre compte'],
  [
    'minlength',
    (passwordError: PasswordError): string =>
      `Le mot de passe doit contenir ${passwordError?.minlength?.requiredLength} caractères au minimum`
  ],
  [
    'missingSpecialChar',
    (): string => 'Le mot de passe doit contenir au moins un caractère spécial\xA0: []{}()<>.:;!?=*+-_\'"/@#%&'
  ],
  ['missingNumber', (): string => 'Le mot de passe doit contenir au moins un chiffre'],
  ['missingUppercaseChar', (): string => 'Le mot de passe doit contenir au moins une lettre en majuscule'],
  ['missingLowercaseChar', (): string => 'Le mot de passe doit contenir au moins une lettre en minuscule'],
  ['forbiddenLeadingSpace', (): string => 'Le mot de passe ne doit pas commencer avec un espace'],
  ['forbiddenTrailingSpace', (): string => 'Le mot de passe ne doit pas se terminer avec un espace'],
  [
    WRONG_PASSWORD_ERROR_NAME,
    (passwordError: PasswordError): string =>
      `Ce mot de passe ne correspond pas à l'identifiant ${passwordError?.wrongPasswordError?.username}`
  ]
]);
