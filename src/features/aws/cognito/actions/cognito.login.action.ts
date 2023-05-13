import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AccountNotActivatedError, InvalidUsernameOrPasswordError, Session } from '@features/authentication';
import { Cognito } from '../providers';
import { CognitoAuthentication, setCognitoAuthenticationToLocalStorage } from '../authentication';

type LoginResponse = { AuthenticationResult: CognitoAuthentication };

const LOGIN_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
  'Content-Type': 'application/x-amz-json-1.1'
};

const loginUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleLoginError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<LoginResponse>): Observable<LoginResponse> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError(() => new InvalidUsernameOrPasswordError());
      case 'NotAuthorizedException':
        return throwError(() => new InvalidUsernameOrPasswordError());
      case 'UserNotConfirmedException':
        return throwError(() => new AccountNotActivatedError(username));
      default:
        return throwError(() => caught);
    }
  };

export const cognitoLoginAction$ =
  (http: HttpClient, cognito: Cognito, session: Session) =>
  (username: string, password: string): Observable<LoginResponse> =>
    http
      .post<LoginResponse>(
        loginUrl(cognito),
        {
          AuthParameters: { USERNAME: username, PASSWORD: password },
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: cognito.clientId
        },
        { headers: LOGIN_HEADERS }
      )
      .pipe(
        catchError(handleLoginError$(username)),
        tap(() => (session.isLoggedIn = true)),
        tap((loginResponse: LoginResponse) => setCognitoAuthenticationToLocalStorage(loginResponse.AuthenticationResult))
      );
