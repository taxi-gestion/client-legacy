import { ValueProvider } from '@angular/core';

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const login = (session: Session): boolean => (session.isLoggedIn = true);

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const logout = (session: Session): boolean => (session.isLoggedIn = false);

export type Session = {
  isLoggedIn: boolean;
  accessToken: () => string | null;
  expiresIn: () => number;
  idToken: () => string | null;
  refresh: () => string | null;
  remainingTime: () => number;
  username: () => string;
  userId: () => string;
  groups: () => string[];
};

export const SESSION_PERSISTENCE: { key: symbol } = { key: Symbol('authentication.session.persistence') };

export const sessionValueProvider = (useValue: Session): ValueProvider => ({
  useValue,
  provide: SESSION_PERSISTENCE
});
