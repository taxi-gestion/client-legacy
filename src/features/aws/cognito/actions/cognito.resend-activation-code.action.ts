import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NoUsernameError, UnknownAccountError } from '@features/authentication';
import { Cognito } from '../providers';

const RESEND_HEADERS: Record<string, string> = {
  'X-Amz-Target': 'AWSCognitoIdentityProviderService.ResendConfirmationCode',
  'Content-Type': 'application/x-amz-json-1.1'
};

const resendUrl = (cognito: Cognito): string => `https://cognito-idp.${cognito.region}.amazonaws.com`;

const handleResendActivationCodeError$ =
  (username: string) =>
  (errorResponse: HttpErrorResponse, caught: Observable<void>): Observable<void> => {
    switch (errorResponse.error.__type) {
      case 'InvalidParameterException':
        return throwError(() => new NoUsernameError());
      case 'UserNotFoundException':
        return throwError(() => new UnknownAccountError(username));
      default:
        return throwError(() => caught);
    }
  };

export const cognitoResendActivationCodeAction$ =
  (http: HttpClient, cognito: Cognito) =>
  (username: string): Observable<void> =>
    http
      .post<void>(resendUrl(cognito), { ClientId: cognito.clientId, Username: username }, { headers: RESEND_HEADERS })
      .pipe(catchError(handleResendActivationCodeError$(username)));
