import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { login, TokenSession } from '@features/authentication';
import { Cognito } from '../providers';
import { CognitoAuthentication, setCognitoAuthenticationToLocalStorage } from '../authentication';

/* eslint-disable @typescript-eslint/naming-convention */
type RefreshTokenResponse = { AuthenticationResult: CognitoAuthentication };

const REFRESH_TOKEN_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
  'Content-Type': 'application/x-amz-json-1.1'
};
/* eslint-enable */

const refreshTokenUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleRefreshTokenError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<RefreshTokenResponse>): Observable<RefreshTokenResponse> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<RefreshTokenResponse> => caught);
    }
  };

export const cognitoRefreshTokenAction$ =
  (http: HttpClient, cognito: Cognito, session: TokenSession) => (): Observable<RefreshTokenResponse> =>
    http
      .post<RefreshTokenResponse>(
        refreshTokenUrl(cognito),
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        { AuthParameters: { REFRESH_TOKEN: session.getRefresh() }, AuthFlow: 'REFRESH_TOKEN_AUTH', ClientId: cognito.clientId },
        { headers: REFRESH_TOKEN_HEADERS }
      )
      .pipe(
        catchError(handleRefreshTokenError$()),
        tap((): boolean => login(session)),
        tap((refreshTokenResponse: RefreshTokenResponse): void =>
          setCognitoAuthenticationToLocalStorage(refreshTokenResponse.AuthenticationResult)
        )
      );
