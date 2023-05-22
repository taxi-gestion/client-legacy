import { Session } from '../../providers';
import { inMemoryLogoutAction } from './in-memory.logout.action';

describe('in memory logout action', (): void => {
  it('should logout from logged in account', (): void => {
    const session: Session = { isLoggedIn: true };

    inMemoryLogoutAction(session)();

    expect(session.isLoggedIn).toBe(false);
  });
});
