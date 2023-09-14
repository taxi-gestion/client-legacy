import { InjectionToken } from '@angular/core';

export const FORM_CONTROL_ERROR_MESSAGES_TOKEN: InjectionToken<Record<string, (controlValue: unknown) => string>> =
  new InjectionToken<Record<string, (controlValue: unknown) => string>>('FORM_CONTROL_ERROR_MESSAGES_TOKEN');
