import { firstValueFrom } from 'rxjs';
import { UnknownAccountError, WrongPasswordError } from '../../errors';
import { Account, Session } from '../../providers';
import { inMemoryLoginAction$ } from './in-memory.login.action';

describe('in memory login action', (): void => {
  it('should login with existing account', async (): Promise<void> => {
    const session: Session = { isLoggedIn: false };
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await firstValueFrom(inMemoryLoginAction$(accounts, session)(account.username, account.password));

    expect(session.isLoggedIn).toStrictEqual(true);
  });

  it('should not login with unknown account', async (): Promise<void> => {
    const session: Session = { isLoggedIn: false };
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await expect(
      firstValueFrom(inMemoryLoginAction$(accounts, session)('unknown@taxi-gestion.com', account.password))
    ).rejects.toEqual(new UnknownAccountError('unknown@taxi-gestion.com'));
  });

  it('should not login with wrong password', async (): Promise<void> => {
    const session: Session = { isLoggedIn: false };
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await firstValueFrom(inMemoryLoginAction$(accounts, session)(account.username, account.password));

    await expect(firstValueFrom(inMemoryLoginAction$(accounts, session)(account.username, 'wrong'))).rejects.toEqual(
      new WrongPasswordError(account.username)
    );
  });
});
