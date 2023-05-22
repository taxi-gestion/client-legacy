import { CODE_ERROR_MESSAGES, CodeError } from './code-error-messages/code.error-message';
import { PASSWORD_ERROR_MESSAGES, PasswordError } from './password-error-messages/password.error-message';
import { USERNAME_ERROR_MESSAGES, UsernameError } from './username-error-messages/username.error-message';
import { ErrorMessages } from '@features/authentication/presentation/message.error';

export * from './field-error-messages.presentation';

type FieldErrors = CodeError | PasswordError | UsernameError;

export const ERROR_MESSAGES: Map<string, ErrorMessages<FieldErrors>> = new Map<
  string,
  Map<string, (errors: FieldErrors) => string>
>([
  ['code', CODE_ERROR_MESSAGES],
  ['password', PASSWORD_ERROR_MESSAGES],
  ['username', USERNAME_ERROR_MESSAGES]
]);
