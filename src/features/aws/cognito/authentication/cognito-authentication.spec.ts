import { getFromJWTPayload, isCognitoTokenExpired } from './cognito-authentication';
import { Serializable } from '@features/authentication';

describe('cognito authentication', (): void => {
  it('should verify that a token is not expired', (): void => {
    const idToken: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzc3OTQ3Nzd9.Eo74PEd8k6j1u-7JoArxHFjL2k0H8jAOu6p_GVqVewI';

    const expired: boolean = isCognitoTokenExpired(idToken, new Date(1677794000000));

    expect(expired).toBe(false);
  });

  it('should verify that a token is expired', (): void => {
    const idToken: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzc3OTQ3Nzd9.Eo74PEd8k6j1u-7JoArxHFjL2k0H8jAOu6p_GVqVewI';

    const expired: boolean = isCognitoTokenExpired(idToken, new Date(1677804777000));

    expect(expired).toBe(true);
  });
});

describe('cognito token payload', (): void => {
  // token that contains a { 'cognito:groups': 'developer' } payload.
  const accessTokenWithPayload: string =
    'plip.eyJzdWIiOiI1YjliMDNmNC00YTc2LTQ3MmUtYjg0NC04ZmI3ZDQ4YjFjNDEiLCJjb2duaXRvOmdyb3VwcyI6WyJkZXZlbG9wZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfNXhFQTZzRG91IiwiY2xpZW50X2lkIjoiNTMwdGFiajY3NjVwbnByOTU4OG9ybms4ZGIiLCJvcmlnaW5fanRpIjoiMDZjNDU3MTktN2QwZi00NWIzLWI0ZDItZTZhNThjODkyMzFiIiwiZXZlbnRfaWQiOiI1OWIzZGUyYS02Mjg0LTQzODktOGQzMy1kZDA5MmVmNTE5ZTYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjg1MzQyNTY5LCJleHAiOjE2ODUzNDM3ODUsImlhdCI6MTY4NTM0MzQ4NSwianRpIjoiODZlNjBiZDMtY2I3Ny00NTRlLTkwYzUtNjBiZThlMDMyOTdhIiwidXNlcm5hbWUiOiI1YjliMDNmNC00YTc2LTQ3MmUtYjg0NC04ZmI3ZDQ4YjFjNDEifQ.plop';

  it('should return null for a null token', (): void => {
    const token: null = null;
    const payload: Serializable | null = getFromJWTPayload(token, 'cognito:groups');

    expect(payload).toBeNull();
  });

  it('should return null for an invalid token', (): void => {
    const token: string = 'invalid-token';
    const payload: Serializable | null = getFromJWTPayload(token, 'cognito:groups');

    expect(payload).toBeNull();
  });

  it('should return null for an invalid key', (): void => {
    const token: string = 'invalid-token';
    const payload: Serializable | null = getFromJWTPayload(token, 'user:groups');

    expect(payload).toBeNull();
  });
  it('should retreive the iss string value', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const retreived: Serializable | null = getFromJWTPayload(accessTokenWithPayload, 'iss');

    expect(retreived).toBe('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5xEA6sDou');
  });

  it('should retreive the cognito:groups array value', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const retreived: Serializable | null = getFromJWTPayload(accessTokenWithPayload, 'cognito:groups');

    expect(retreived).toStrictEqual(['developer']);
  });
});
