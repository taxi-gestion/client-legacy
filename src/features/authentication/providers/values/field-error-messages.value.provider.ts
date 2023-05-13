import { ValueProvider } from '@angular/core';

export type FieldErrorMessages<T> = Map<string, Map<string, (errors: T) => string>>;

export const FIELD_ERROR_MESSAGES_CONFIGURATION = 'authentication.field-error-messages.configuration' as const;

export const fieldErrorMessagesValueProvider = <T>(useValue: FieldErrorMessages<T>): ValueProvider => ({
  useValue,
  provide: FIELD_ERROR_MESSAGES_CONFIGURATION
});
