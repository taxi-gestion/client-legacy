import { logout, Session } from '@features/authentication';
import { clearCognitoAuthenticationFromLocalStorage } from '../session';

export const cognitoLogoutAction = (session: Session) => (): void => {
  clearCognitoAuthenticationFromLocalStorage();
  logout(session);
};
