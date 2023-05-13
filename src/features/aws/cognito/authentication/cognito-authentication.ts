import { TokenSession } from '@features/authentication';

const COGNITO_STORAGE_KEY: string = 'aws.cognito';
export const ACCESS_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.access-token`;
export const ID_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.id-token`;
export const REFRESH_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.refresh-token`;
export const EXPIRES_IN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.expires-in`;

export type CognitoAuthentication = {
  AccessToken: string;
  IdToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
  TokenType: 'Bearer';
};

const MILLISECONDS = 1000 as const;

const getPayload = (token: string): string | undefined => token.split('.').at(1);

const decodeTokenPart = (tokenPayload: string): { exp: number } => JSON.parse(atob(tokenPayload));

const tokenExpirationTime = (payload?: string): number => (payload ? decodeTokenPart(payload).exp * MILLISECONDS : 0);

const substractTimeToTokenExpiration = (token: string, now: Date): number =>
  tokenExpirationTime(getPayload(token)) - now.getTime();

export const isCognitoTokenExpired = (token: string, now: Date): boolean => substractTimeToTokenExpiration(token, now) < 0;

const isCognitoAuthenticationActive: boolean = ((idToken: string | null): boolean =>
  idToken ? !isCognitoTokenExpired(idToken, new Date()) : false)(localStorage.getItem(ID_TOKEN_STORAGE_KEY));

export const cognitoTokenSession = (): TokenSession => ({
  isLoggedIn: isCognitoAuthenticationActive,
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
  getId: () => localStorage.getItem(ID_TOKEN_STORAGE_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  getExpiresIn: () => +(localStorage.getItem(EXPIRES_IN_STORAGE_KEY) ?? NaN),
  getRemainingTime: () => substractTimeToTokenExpiration(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? '', new Date())
});

export const setCognitoAuthenticationToLocalStorage = (cognitoAuthentication: CognitoAuthentication): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, cognitoAuthentication.AccessToken);
  localStorage.setItem(ID_TOKEN_STORAGE_KEY, cognitoAuthentication.IdToken);
  cognitoAuthentication.RefreshToken && localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, cognitoAuthentication.RefreshToken);
  localStorage.setItem(EXPIRES_IN_STORAGE_KEY, cognitoAuthentication.ExpiresIn.toString());
};

export const clearCognitoAuthenticationFromLocalStorage = (): void => {
  [ACCESS_TOKEN_STORAGE_KEY, ID_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, EXPIRES_IN_STORAGE_KEY].forEach((key: string) =>
    localStorage.removeItem(key)
  );
};
