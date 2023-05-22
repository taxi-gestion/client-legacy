import { logout, Session } from '@features/authentication';
import { clearCognitoAuthenticationFromLocalStorage } from '@features/aws';

export const cognitoLogoutAction = (session: Session) => (): void => {
  clearCognitoAuthenticationFromLocalStorage();
  logout(session);
};
