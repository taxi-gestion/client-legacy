import { ValueProvider } from '@angular/core';

export type RedirectRoutesKeys =
  | 'activate'
  | 'forgot-password'
  | 'login'
  | 'logout'
  | 'not-activated'
  | 'register'
  | 'reset-password'
  | 'session-expired';

export type RedirectRoutes = Map<RedirectRoutesKeys, string>;

export const REDIRECT_ROUTES_PERSISTENCE: { key: symbol } = { key: Symbol('authentication.redirect-routes.persistence') };

export const redirectRoutesValueProvider = (useValue: RedirectRoutes): ValueProvider => ({
  useValue,
  provide: REDIRECT_ROUTES_PERSISTENCE
});
