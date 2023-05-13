import { authorizedRouteMatchPattern, isValidToken } from './bearer-token.interceptor';

describe('bearer token forward on regex match', (): void => {
  const matchApiRegex: RegExp = /\/api/;
  it('should not forward bearer token if token is null', (): void => {
    expect(isValidToken(null) && authorizedRouteMatchPattern(matchApiRegex)('https://google.com/api/lol')).toBeFalsy();
  });

  it('should not forward bearer token if url does not match regex', (): void => {
    expect(isValidToken('plop') && authorizedRouteMatchPattern(matchApiRegex)('https://google.com/lol')).toBeFalsy();
  });

  it('should forward bearer token if regex match and token is a non-empty string', (): void => {
    expect(
      isValidToken('plop') && authorizedRouteMatchPattern(matchApiRegex)('https://google.com/api/fares/1243')
    ).toBeTruthy();
  });
});
