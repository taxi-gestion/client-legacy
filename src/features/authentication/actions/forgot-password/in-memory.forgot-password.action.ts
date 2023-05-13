import { delay, Observable, of, tap, throwError } from 'rxjs';
import { UnknownAccountError } from '../../errors';
import { Account } from '../../providers';

const findAccountToReset = (accounts: Account[], username: string): Account | undefined =>
  accounts.find((account: Account) => account.username === username);

const setPasswordResetCode = (accountToReset: Account | undefined, resetPasswordCode: string): string | undefined =>
  accountToReset && (accountToReset.resetPasswordCode = resetPasswordCode);

const unknownAccount = (accounts: Account[], username: string): boolean =>
  accounts.find((account: Account) => account.username === username) == null;

const generateResetPasswordCode = (): string => Math.random().toString(36).slice(-8);

export const inMemoryForgotPasswordAction$ =
  (accounts: Account[]) =>
  (username: string, resetPasswordCode: string = generateResetPasswordCode()): Observable<void> =>
    unknownAccount(accounts, username)
      ? throwError(() => new UnknownAccountError(username))
      : of(void 0).pipe(
          delay(300),
          tap(() => {
            setPasswordResetCode(findAccountToReset(accounts, username), resetPasswordCode);
            // eslint-disable-next-line no-console
            console.info(resetPasswordCode);
          })
        );
