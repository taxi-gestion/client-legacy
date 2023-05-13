import { Account } from '../../providers';
import { inMemoryRegisterAction$ } from './in-memory.register.action';
import { firstValueFrom } from 'rxjs';
import { AccountAlreadyExistError } from '../../errors';

describe('in memory register action', (): void => {
  it('should register a new account', async (): Promise<void> => {
    const accounts: Account[] = [];
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };

    await firstValueFrom(inMemoryRegisterAction$(accounts)(account.username, account.password));

    expect(accounts).toStrictEqual([account]);
  });

  it('should not register an account that already exists', async (): Promise<void> => {
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await expect(firstValueFrom(inMemoryRegisterAction$(accounts)(account.username, account.password))).rejects.toEqual(
      new AccountAlreadyExistError(account.username)
    );
  });
});
