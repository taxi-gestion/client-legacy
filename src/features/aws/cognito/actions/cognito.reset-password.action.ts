import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LimitExceededError, InvalidCodeError, UnknownAccountError } from '@features/authentication';
import { Cognito } from '../providers';

const RESET_PASSWORD_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmForgotPassword',
  'Content-Type': 'application/x-amz-json-1.1'
};

const resetPasswordUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleResetPasswordError$ =
  (username: string, code: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<void>): Observable<void> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError(() => new UnknownAccountError(username));
      case 'LimitExceededException':
        return throwError(() => new LimitExceededError());
      case 'CodeMismatchException':
        return throwError(() => new InvalidCodeError(code));
      case 'ExpiredCodeException':
        return throwError(() => new InvalidCodeError(code));
      default:
        return throwError(() => caught);
    }
  };

export const cognitoResetPasswordAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string, code: string, newPassword: string): Observable<void> =>
    http
      .post<void>(
        resetPasswordUrl(cognito),
        {
          ClientId: cognito.clientId,
          Username: username,
          ConfirmationCode: code,
          Password: newPassword
        },
        { headers: RESET_PASSWORD_HEADERS }
      )
      .pipe(catchError(handleResetPasswordError$(username, code)));
