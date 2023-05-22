import { INVALID_CODE_ERROR_NAME, InvalidCodeError } from '../../../errors';

export type CodeError = {
  required?: boolean;
  invalidCodeError?: InvalidCodeError;
} | null;

export const CODE_ERROR_MESSAGES: Map<string, (error: CodeError) => string> = new Map([
  [INVALID_CODE_ERROR_NAME, (codeError: CodeError): string => `Le code ${codeError?.invalidCodeError?.code} n'est pas valide`],
  ['required', (): string => "Saisissez le code d'activation"]
]);
