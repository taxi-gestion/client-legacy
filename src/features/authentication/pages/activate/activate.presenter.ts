import { INVALID_CODE_ERROR_NAME, isNoUsernameError, isUnknownAccountError } from '../../errors';

export type FormattedActivateError = { field?: string; errors: Record<string, unknown> };

const activateErrorFormatMap: Map<string, (error: Error) => FormattedActivateError> = new Map([
  [
    INVALID_CODE_ERROR_NAME,
    (error: Error) => ({
      field: 'code',
      errors: {
        [INVALID_CODE_ERROR_NAME]: error
      }
    })
  ]
]);

export const formatActivateError = (error: Error): FormattedActivateError =>
  activateErrorFormatMap.get(error.name)?.(error) ?? { errors: { unknown: true } };

export const activationCodeErrorMessageFrom = (error: Error): string => {
  if (isUnknownAccountError(error)) return `Il n'existe aucun compte associé à l'identifiant ${error?.username}`;
  if (isNoUsernameError(error)) return "Saisissez l'email ou le numéro téléphone portable associé à votre compte";
  return 'Une erreur inconnue est survenue';
};
