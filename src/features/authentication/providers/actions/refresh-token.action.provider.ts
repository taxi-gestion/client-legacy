import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type RefreshTokenAction<T> = () => Observable<T>;

export const REFRESH_TOKEN_ACTION: symbol = Symbol('authentication.refresh-token.action');

export const refreshTokenActionProvider = <TDependencies, TResult>(
  useFactory: (...providers: never[]) => RefreshTokenAction<TResult>,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: REFRESH_TOKEN_ACTION,
  useFactory,
  deps
});
