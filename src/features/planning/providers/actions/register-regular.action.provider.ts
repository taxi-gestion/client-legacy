import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { RegularDetails, RegularRegistered } from '@definitions';

export type RegisterRegularAction = (regular: RegularDetails) => Observable<RegularRegistered>;

export const REGISTER_REGULAR_ACTION: symbol = Symbol('planning.register-regular.action');

export const registerRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => RegisterRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: REGISTER_REGULAR_ACTION,
  useFactory,
  deps
});
