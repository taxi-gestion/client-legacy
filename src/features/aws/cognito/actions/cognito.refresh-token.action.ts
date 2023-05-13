import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { TokenSession } from '@features/authentication';
import { Cognito } from '../providers';
import { CognitoAuthentication, setCognitoAuthenticationToLocalStorage } from '../authentication';

type RefreshTokenResponse = { AuthenticationResult: CognitoAuthentication };

const RefreshToken_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
  'Content-Type': 'application/x-amz-json-1.1'
};

const refreshTokenUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleRefreshTokenError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<RefreshTokenResponse>): Observable<RefreshTokenResponse> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError(() => caught);
    }
  };

export const cognitoRefreshTokenAction$ =
  (http: HttpClient, cognito: Cognito, session: TokenSession) => (): Observable<RefreshTokenResponse> =>
    http
      .post<RefreshTokenResponse>(
        refreshTokenUrl(cognito),
        { AuthParameters: { REFRESH_TOKEN: session.getRefresh() }, AuthFlow: 'REFRESH_TOKEN_AUTH', ClientId: cognito.clientId },
        { headers: RefreshToken_HEADERS }
      )
      .pipe(
        catchError(handleRefreshTokenError$()),
        tap(() => (session.isLoggedIn = true)),
        tap((refreshTokenResponse: RefreshTokenResponse) =>
          setCognitoAuthenticationToLocalStorage(refreshTokenResponse.AuthenticationResult)
        )
      );
