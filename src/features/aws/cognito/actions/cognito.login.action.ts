import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AccountNotActivatedError, InvalidUsernameOrPasswordError, login, Session } from '@features/authentication';
import { Cognito } from '../providers';
import { CognitoAuthentication, setCognitoAuthenticationToLocalStorage } from '../authentication';

/* eslint-disable @typescript-eslint/naming-convention */
type LoginResponse = { AuthenticationResult: CognitoAuthentication };

const LOGIN_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
  'Content-Type': 'application/x-amz-json-1.1'
};
/* eslint-enable */

const loginUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleLoginError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<LoginResponse>): Observable<LoginResponse> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError((): Error => new InvalidUsernameOrPasswordError());
      case 'NotAuthorizedException':
        return throwError((): Error => new InvalidUsernameOrPasswordError());
      case 'UserNotConfirmedException':
        return throwError((): Error => new AccountNotActivatedError(username));
      default:
        return throwError((): Observable<LoginResponse> => caught);
    }
  };

export const cognitoLoginAction$ =
  (http: HttpClient, cognito: Cognito, session: Session) =>
  (username: string, password: string): Observable<LoginResponse> =>
    http
      .post<LoginResponse>(
        loginUrl(cognito),
        /* eslint-disable @typescript-eslint/naming-convention */
        {
          AuthParameters: { USERNAME: username, PASSWORD: password },
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: cognito.clientId
        },
        /* eslint-enable */
        { headers: LOGIN_HEADERS }
      )
      .pipe(
        catchError(handleLoginError$(username)),
        tap((): boolean => login(session)),
        tap((loginResponse: LoginResponse): void => setCognitoAuthenticationToLocalStorage(loginResponse.AuthenticationResult))
      );
