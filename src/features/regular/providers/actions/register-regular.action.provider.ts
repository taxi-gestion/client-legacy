import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRegular, Regular } from '@definitions';

export type RegisterRegularAction = (regular: Regular) => Observable<RegisterRegular>;

export const REGISTER_REGULAR_ACTION: { key: symbol } = { key: Symbol('regular.register-regular.action') };

export const registerRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => RegisterRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: REGISTER_REGULAR_ACTION,
  useFactory,
  deps
});
