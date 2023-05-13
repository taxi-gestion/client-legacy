import { delay, Observable, of, tap, throwError } from 'rxjs';
import { UnknownAccountError, WrongPasswordError } from '../../errors';
import { Account, Session } from '../../providers';

const unknownAccount = (accounts: Account[], username: string): boolean =>
  accounts.find((account: Account) => account.username === username) == null;

const wrongPassword = (accounts: Account[], username: string, password: string): boolean =>
  accounts.find((account: Account) => account.username === username)?.password !== password;

export const inMemoryLoginAction$ =
  (accounts: Account[], session: Session) =>
  (username: string, password: string): Observable<void> => {
    if (unknownAccount(accounts, username)) return throwError(() => new UnknownAccountError(username));
    if (wrongPassword(accounts, username, password)) return throwError(() => new WrongPasswordError(username));

    return of(void 0).pipe(
      delay(300),
      tap(() => (session.isLoggedIn = true))
    );
  };
