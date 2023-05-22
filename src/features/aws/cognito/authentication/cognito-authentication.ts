import { TokenSession } from '@features/authentication';

const COGNITO_STORAGE_KEY: string = 'aws.cognito';
export const ACCESS_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.access-token`;
export const ID_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.id-token`;
export const REFRESH_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.refresh-token`;
export const EXPIRES_IN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.expires-in`;

/* eslint-disable @typescript-eslint/naming-convention */
export type CognitoAuthentication = {
  AccessToken: string;
  IdToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
  TokenType: 'Bearer';
};
/* eslint-enable */

const MILLISECONDS: 1000 = 1000 as const;

const getPayload = (token: string): string | undefined => token.split('.').at(1);

const decodeTokenPart = (tokenPayload: string): { exp: number } => JSON.parse(atob(tokenPayload)) as { exp: number };

const tokenExpirationTime = (payload?: string): number => (payload == null ? 0 : decodeTokenPart(payload).exp * MILLISECONDS);

const substractTimeToTokenExpiration = (token: string, now: Date): number =>
  tokenExpirationTime(getPayload(token)) - now.getTime();

export const isCognitoTokenExpired = (token: string, now: Date): boolean => substractTimeToTokenExpiration(token, now) < 0;

const isCognitoAuthenticationActive: boolean = ((idToken: string | null): boolean =>
  idToken == null ? false : !isCognitoTokenExpired(idToken, new Date()))(localStorage.getItem(ID_TOKEN_STORAGE_KEY));

export const cognitoTokenSession = (): TokenSession => ({
  isLoggedIn: isCognitoAuthenticationActive,
  getAccess: (): string | null => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
  getId: (): string | null => localStorage.getItem(ID_TOKEN_STORAGE_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  getExpiresIn: (): number => +(localStorage.getItem(EXPIRES_IN_STORAGE_KEY) ?? NaN),
  getRemainingTime: (): number =>
    substractTimeToTokenExpiration(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? '', new Date())
});

export const setCognitoAuthenticationToLocalStorage = (cognitoAuthentication: CognitoAuthentication): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, cognitoAuthentication.AccessToken);
  localStorage.setItem(ID_TOKEN_STORAGE_KEY, cognitoAuthentication.IdToken);
  cognitoAuthentication.RefreshToken != null &&
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, cognitoAuthentication.RefreshToken);
  localStorage.setItem(EXPIRES_IN_STORAGE_KEY, cognitoAuthentication.ExpiresIn.toString());
};

export const clearCognitoAuthenticationFromLocalStorage = (): void => {
  [ACCESS_TOKEN_STORAGE_KEY, ID_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, EXPIRES_IN_STORAGE_KEY].forEach(
    (key: string): void => {
      localStorage.removeItem(key);
    }
  );
};
