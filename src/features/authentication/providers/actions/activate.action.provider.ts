import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type ActivateAction = (username: string, code: string) => Observable<object>;

export const ACTIVATE_ACTION: symbol = Symbol('authentication.activate.action');

export const activateActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ActivateAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ACTIVATE_ACTION,
  useFactory,
  deps
});
