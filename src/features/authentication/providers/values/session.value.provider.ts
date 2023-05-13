import { ValueProvider } from '@angular/core';

export type Session = {
  isLoggedIn: boolean;
};

export type TokenSession = Session & {
  getAccess: () => string | null;
  getId: () => string | null;
  getRefresh: () => string | null;
  getExpiresIn: () => number;
  getRemainingTime: () => number;
};

export const SESSION_PERSISTENCE = 'authentication.session.persistence' as const;

export const sessionValueProvider = (useValue: Session | TokenSession): ValueProvider => ({
  useValue,
  provide: SESSION_PERSISTENCE
});
