import { Session } from '../../providers';

export const inMemoryLogoutAction = (session: Session) => (): void => {
  session.isLoggedIn = false;
};
