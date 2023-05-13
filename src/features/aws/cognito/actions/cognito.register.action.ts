import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountAlreadyExistError } from '@features/authentication';
import { Cognito } from '../providers';

const REGISTER_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
  'Content-Type': 'application/x-amz-json-1.1'
};

const registerUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleRegisterError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      case 'UsernameExistsException':
        return throwError(() => new AccountAlreadyExistError(username));
      default:
        return throwError(() => caught);
    }
  };

export const cognitoRegisterAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string, password: string): Observable<object> =>
    http
      .post(
        registerUrl(cognito),
        { Username: username, Password: password, ClientId: cognito.clientId },
        { headers: REGISTER_HEADERS }
      )
      .pipe(catchError(handleRegisterError$(username)));
