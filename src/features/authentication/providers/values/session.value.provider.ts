import { ValueProvider } from '@angular/core';

export type Session = {
  isLoggedIn: boolean;
};

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const login = (session: Session): boolean => (session.isLoggedIn = true);

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const logout = (session: Session): boolean => (session.isLoggedIn = false);

export type TokenSession = Session & {
  getAccess: () => string | null;
  getId: () => string | null;
  getRefresh: () => string | null;
  getExpiresIn: () => number;
  getRemainingTime: () => number;
};

export const SESSION_PERSISTENCE: 'authentication.session.persistence' = 'authentication.session.persistence' as const;

export const sessionValueProvider = (useValue: Session | TokenSession): ValueProvider => ({
  useValue,
  provide: SESSION_PERSISTENCE
});
