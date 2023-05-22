import { logout, Session } from '../../providers';

export const inMemoryLogoutAction = (session: Session) => (): void => {
  logout(session);
};
