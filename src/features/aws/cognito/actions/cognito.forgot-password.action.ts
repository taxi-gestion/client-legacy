import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LimitExceededError, UnknownAccountError } from '@features/authentication';
import { Cognito } from '../providers';

/* eslint-disable @typescript-eslint/naming-convention */
const FORGOT_PASSWORD_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ForgotPassword',
  'Content-Type': 'application/x-amz-json-1.1'
};
/* eslint-enable */

const forgotPasswordUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleForgotPasswordError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<void>): Observable<void> => {
    switch (errorResponse.error.__type) {
      case 'UserNotFoundException':
        return throwError((): Error => new UnknownAccountError(username));
      case 'LimitExceededException':
        return throwError((): Error => new LimitExceededError());
      default:
        return throwError((): Observable<void> => caught);
    }
  };

export const cognitoForgotPasswordAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string): Observable<void> =>
    http
      .post<never>(
        forgotPasswordUrl(cognito),
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        { ClientId: cognito.clientId, Username: username },
        { headers: FORGOT_PASSWORD_HEADERS }
      )
      .pipe(catchError(handleForgotPasswordError$(username)));
