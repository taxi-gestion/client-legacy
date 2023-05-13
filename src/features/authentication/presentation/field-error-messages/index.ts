import { CODE_ERROR_MESSAGES, CodeErrors } from './code-error-messages/code.error-message';
import { PASSWORD_ERROR_MESSAGES, PasswordErrors } from './password-error-messages/password.error-message';
import { USERNAME_ERROR_MESSAGES, UsernameErrors } from './username-error-messages/username.error-message';

export * from './field-error-messages.presentation';

type FieldErrors = CodeErrors | PasswordErrors | UsernameErrors;

export const ERROR_MESSAGES = new Map<string, Map<string, (errors: FieldErrors) => string>>([
  ['code', CODE_ERROR_MESSAGES],
  ['password', PASSWORD_ERROR_MESSAGES],
  ['username', USERNAME_ERROR_MESSAGES]
]);
