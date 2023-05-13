import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type ResetPasswordAction = (username: string, code: string, newPassword: string) => Observable<void>;

export const RESET_PASSWORD_ACTION = Symbol();

export const resetPasswordActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ResetPasswordAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: RESET_PASSWORD_ACTION,
  useFactory,
  deps
});
