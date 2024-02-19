import { ValueProvider } from '@angular/core';

export type Account = {
  username: string;
  password: string;
  resetPasswordCode?: string;
};

/* eslint-disable no-param-reassign, no-return-assign */
export const setResetPasswordCode = (account: Account, resetPasswordCode: string): string =>
  (account.resetPasswordCode = resetPasswordCode);
/* eslint-enable */
export const ACCOUNTS_PERSISTENCE: { key: symbol } = { key: Symbol('authentication.accounts.persistence') };

export const accountsValueProvider = (useValue: Account[] = []): ValueProvider => ({
  useValue,
  provide: ACCOUNTS_PERSISTENCE
});
