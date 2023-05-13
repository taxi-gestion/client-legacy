import { firstValueFrom } from 'rxjs';
import { UnknownAccountError } from '../../errors';
import { Account } from '../../providers';
import { inMemoryForgotPasswordAction$ } from './in-memory.forgot-password.action';

describe('in memory forgot-password action', (): void => {
  it('should set reset password code to account to reset', async (): Promise<void> => {
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await firstValueFrom(inMemoryForgotPasswordAction$(accounts)(account.username, '7868965'));

    expect(account.resetPasswordCode).toStrictEqual('7868965');
  });

  it('should not set reset password code to unknown account', async (): Promise<void> => {
    const account: Account = { username: 'test@taxi-gestion.com', password: '5Hx$M8/y' };
    const accounts: Account[] = [account];

    await expect(
      firstValueFrom(inMemoryForgotPasswordAction$(accounts)('unknown@taxi-gestion.com', '7868965'))
    ).rejects.toEqual(new UnknownAccountError('unknown@taxi-gestion.com'));
  });
});
