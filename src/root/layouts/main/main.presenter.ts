import { Serializable, TokenSession } from '@features/authentication';

export type UserPresentation = {
  username: Serializable;
  groups: Serializable;
};

export const userFromSession = (tokenSession: TokenSession): UserPresentation => ({
  username: tokenSession.idTokenPayload('email') ?? tokenSession.idTokenPayload('phone_number'),
  groups: tokenSession.accessTokenPayload('cognito:groups')
});
