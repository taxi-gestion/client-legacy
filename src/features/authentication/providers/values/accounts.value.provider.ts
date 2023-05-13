import { ValueProvider } from '@angular/core';

export type Account = {
  username: string;
  password: string;
  resetPasswordCode?: string;
};

export const ACCOUNTS_PERSISTENCE = 'authentication.accounts.persistence' as const;

export const accountsValueProvider = (useValue: Account[] = []): ValueProvider => ({
  useValue,
  provide: ACCOUNTS_PERSISTENCE
});
