import { delay, Observable, of, tap, throwError } from 'rxjs';
import { Account } from '../../providers';
import { AccountAlreadyExistError } from '../../errors';

const alreadyRegistered = (accounts: Account[], username: string): boolean =>
  accounts.some((account: Account): boolean => account.username === username);

export const inMemoryRegisterAction$ =
  (accounts: Account[]) =>
  (username: string, password: string): Observable<void> =>
    alreadyRegistered(accounts, username)
      ? throwError((): Error => new AccountAlreadyExistError(username))
      : of(undefined).pipe(
          delay(300),
          tap((): number => accounts.push({ username, password }))
        );
