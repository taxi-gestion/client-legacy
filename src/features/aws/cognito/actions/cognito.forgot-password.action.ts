import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LimitExceededError, UnknownAccountError } from '@features/authentication';
import { Cognito } from '../providers';

const FORGOT_PASSWORD_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ForgotPassword',
  'Content-Type': 'application/x-amz-json-1.1'
};

const forgotPasswordUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleForgotPasswordError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<void>): Observable<void> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError(() => new UnknownAccountError(username));
      case 'LimitExceededException':
        return throwError(() => new LimitExceededError());
      default:
        return throwError(() => caught);
    }
  };

export const cognitoForgotPasswordAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string): Observable<void> =>
    http
      .post<void>(
        forgotPasswordUrl(cognito),
        { ClientId: cognito.clientId, Username: username },
        { headers: FORGOT_PASSWORD_HEADERS }
      )
      .pipe(catchError(handleForgotPasswordError$(username)));
