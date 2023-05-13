import { INVALID_CODE_ERROR_NAME, InvalidCodeError } from '../../../errors';

export type CodeErrors = {
  required?: boolean;
  invalidCodeError?: InvalidCodeError;
} | null;

export const CODE_ERROR_MESSAGES: Map<string, (errors: CodeErrors) => string> = new Map([
  [
    INVALID_CODE_ERROR_NAME,
    (codeErrors: CodeErrors): string => `Le code ${codeErrors?.invalidCodeError?.code} n'est pas valide`
  ],
  ['required', (): string => "Saisissez le code d'activation"]
]);
