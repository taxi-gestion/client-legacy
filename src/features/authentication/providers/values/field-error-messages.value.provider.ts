import { ValueProvider } from '@angular/core';

export type FieldErrorMessages<T> = Map<string, Map<string, (errors: T) => string>>;

export const FIELD_ERROR_MESSAGES_CONFIGURATION: { key: symbol } = {
  key: Symbol('authentication.field-error-messages.configuration')
};

export const fieldErrorMessagesValueProvider = <T>(useValue: FieldErrorMessages<T>): ValueProvider => ({
  useValue,
  provide: FIELD_ERROR_MESSAGES_CONFIGURATION
});
