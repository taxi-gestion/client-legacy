import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { InvalidCodeError } from '@features/authentication';
import { Cognito } from '../providers';

const ACTIVATE_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
  'Content-Type': 'application/x-amz-json-1.1'
};

const activateUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleActivateError$ =
  (code: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      case 'ExpiredCodeException':
        return throwError(() => new InvalidCodeError(code));
      default:
        return throwError(() => caught);
    }
  };

export const cognitoActivateAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string, code: string): Observable<object> =>
    http
      .post(
        activateUrl(cognito),
        { Username: username, ConfirmationCode: code, ClientId: cognito.clientId },
        { headers: ACTIVATE_HEADERS }
      )
      .pipe(catchError(handleActivateError$(code)));
