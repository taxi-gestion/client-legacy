import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RegisterRegularAction } from '../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedBeforeApiCallError } from '../errors';
import { Regular } from '@domain';
import { regularPassengerCodec } from '@codecs';

const registerRegularUrl = (): string => `https://taxi-gestion.com/api/register-regular`;

const handleRegisterRegularError$ = (
  errorResponse: Error | HttpErrorResponse,
  caught: Observable<object>
): Observable<object> => {
  if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

  switch ((errorResponse as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<object> => caught);
  }
};

export const validatedRegisterRegularAction$ =
  (http: HttpClient): RegisterRegularAction =>
  (regular: Regular): Observable<object> =>
    fpPipe(
      regularPassengerCodec.decode(regular),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleRegisterRegularError$)),
        (validatedTransfer: Regular): Observable<object> =>
          http.post(registerRegularUrl(), validatedTransfer).pipe(catchError(handleRegisterRegularError$))
      )
    );
