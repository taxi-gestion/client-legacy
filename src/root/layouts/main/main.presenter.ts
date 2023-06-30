import { Session } from '@features/authentication';

export type UserPresentation = {
  username: string;
  groups: string[];
};

export const userFromSession = (tokenSession: Session): UserPresentation => ({
  username: tokenSession.username(),
  groups: tokenSession.groups()
});
