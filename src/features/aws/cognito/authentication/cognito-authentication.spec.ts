import { isCognitoTokenExpired } from './cognito-authentication';

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
