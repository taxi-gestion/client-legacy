import type { Session } from '@features/authentication';

const COGNITO_STORAGE_KEY: string = 'aws.cognito';
export const ACCESS_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.access-token`;
export const ID_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.id-token`;
export const REFRESH_TOKEN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.refresh-token`;
export const EXPIRES_IN_STORAGE_KEY: string = `${COGNITO_STORAGE_KEY}.expires-in`;

/* eslint-disable @typescript-eslint/naming-convention */
export type CognitoSession = {
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

const urlEncodedToBase64 = (urlEncoded: string | undefined): string | null =>
  typeof urlEncoded === 'string' ? urlEncoded.replace(/-/gu, '+').replace(/_/gu, '/') : null;

const base64ToJsonString = (base64: string | null): string | null =>
  base64 == null
    ? null
    : decodeURIComponent(
        atob(base64)
          .split('')
          .map((char: string): string => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );

const tryParse = <T>(jsonPayloadString: string, key: string): T | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(jsonPayloadString)[key];
  } catch (_: unknown) {
    return null;
  }
};

export const getFromJWTPayload = <T>(token: string | null, key: string): T | null => {
  if (token === null) return null;
  const urlEncodedPayload: string | undefined = getPayload(token);
  const base64Payload: string | null = urlEncodedToBase64(urlEncodedPayload);
  const jsonPayload: string | null = base64ToJsonString(base64Payload);

  return jsonPayload === null ? null : tryParse(jsonPayload, key);
};

export const isCognitoTokenExpired = (token: string, now: Date): boolean => substractTimeToTokenExpiration(token, now) < 0;

const isCognitoAuthenticationActive: boolean = ((idToken: string | null): boolean =>
  idToken == null ? false : !isCognitoTokenExpired(idToken, new Date()))(localStorage.getItem(ID_TOKEN_STORAGE_KEY));

export const cognitoSession = (): Session => ({
  isLoggedIn: isCognitoAuthenticationActive,
  accessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
  idToken: (): string | null => localStorage.getItem(ID_TOKEN_STORAGE_KEY),
  refresh: (): string | null => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  expiresIn: (): number => +(localStorage.getItem(EXPIRES_IN_STORAGE_KEY) ?? NaN),
  remainingTime: (): number => substractTimeToTokenExpiration(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? '', new Date()),
  username: (): string =>
    getFromJWTPayload(localStorage.getItem(ID_TOKEN_STORAGE_KEY), 'email') ??
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getFromJWTPayload(localStorage.getItem(ID_TOKEN_STORAGE_KEY), 'phone_number')!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  groups: (): string[] => getFromJWTPayload(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY), 'cognito:groups')!
});

export const setCognitoAuthenticationToLocalStorage = (cognitoAuthentication: CognitoSession): void => {
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
