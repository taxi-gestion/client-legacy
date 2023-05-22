import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LimitExceededError, InvalidCodeError, UnknownAccountError } from '@features/authentication';
import { Cognito } from '../providers';

/* eslint-disable @typescript-eslint/naming-convention */
const RESET_PASSWORD_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmForgotPassword',
  'Content-Type': 'application/x-amz-json-1.1'
};
/* eslint-enable */

const resetPasswordUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleResetPasswordError$ =
  (username: string, code: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<void>): Observable<void> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError((): Error => new UnknownAccountError(username));
      case 'LimitExceededException':
        return throwError((): Error => new LimitExceededError());
      case 'CodeMismatchException':
        return throwError((): Error => new InvalidCodeError(code));
      case 'ExpiredCodeException':
        return throwError((): Error => new InvalidCodeError(code));
      default:
        return throwError((): Observable<void> => caught);
    }
  };

export const cognitoResetPasswordAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string, code: string, newPassword: string): Observable<void> =>
    http
      .post<never>(
        resetPasswordUrl(cognito),
        /* eslint-disable @typescript-eslint/naming-convention */
        {
          ClientId: cognito.clientId,
          Username: username,
          ConfirmationCode: code,
          Password: newPassword
        },
        /* eslint-enable */
        { headers: RESET_PASSWORD_HEADERS }
      )
      .pipe(catchError(handleResetPasswordError$(username, code)));
