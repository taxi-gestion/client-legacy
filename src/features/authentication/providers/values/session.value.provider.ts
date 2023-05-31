import { ValueProvider } from '@angular/core';

export type Session = {
  isLoggedIn: boolean;
};

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const login = (session: Session): boolean => (session.isLoggedIn = true);

/* eslint-disable-next-line no-param-reassign, no-return-assign */
export const logout = (session: Session): boolean => (session.isLoggedIn = false);

type Literal = boolean | number | string | null;
export type Serializable = Literal | Serializable[] | { [key: string]: Serializable };

export type TokenSession = Session & {
  accessToken: () => string | null;
  accessTokenPayload: (key: string) => Serializable | null;
  expiresIn: () => number;
  idToken: () => string | null;
  idTokenPayload: (key: string) => Serializable | null;
  refresh: () => string | null;
  remainingTime: () => number;
};

export const SESSION_PERSISTENCE: 'authentication.session.persistence' = 'authentication.session.persistence' as const;

export const sessionValueProvider = (useValue: Session | TokenSession): ValueProvider => ({
  useValue,
  provide: SESSION_PERSISTENCE
});
