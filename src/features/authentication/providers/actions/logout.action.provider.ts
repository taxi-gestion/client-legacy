import { FactoryProvider } from '@angular/core';

export type LogoutAction = () => void;

export const LOGOUT_ACTION: symbol = Symbol('authentication.logout.action');

export const logoutActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => LogoutAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: LOGOUT_ACTION,
  useFactory,
  deps
});
