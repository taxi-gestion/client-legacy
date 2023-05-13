import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type LoginAction<T> = (username: string, password: string) => Observable<T>;

export const LOGIN_ACTION = 'authentication.login.action' as const;

export const loginActionProvider = <TDependencies, TResult>(
  useFactory: (...providers: never[]) => LoginAction<TResult>,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: LOGIN_ACTION,
  useFactory,
  deps
});
