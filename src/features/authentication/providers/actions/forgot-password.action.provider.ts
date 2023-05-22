import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type ForgotPasswordAction = (username: string) => Observable<void>;

export const FORGOT_PASSWORD_ACTION: symbol = Symbol('authentication.forgot-password.action');

export const forgotPasswordActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ForgotPasswordAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FORGOT_PASSWORD_ACTION,
  useFactory,
  deps
});
