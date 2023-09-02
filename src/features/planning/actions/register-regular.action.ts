import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterRegularAction } from '../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { Regular, RegularRegistered } from '@definitions';
import { externalTypeCheckFor, regularPassengerCodec, regularRegisteredCodec } from '@codecs';

const registerRegularUrl = (): string => `/api/regular/register`;

export const validatedRegisterRegularAction$ =
  (http: HttpClient): RegisterRegularAction =>
  (regular: Regular): Observable<RegularRegistered> =>
    fpPipe(
      regularPassengerCodec.decode(regular),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: Regular): Observable<RegularRegistered> =>
          http.post<unknown>(registerRegularUrl(), validatedTransfer).pipe(
            map(registeredRegularValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<RegularRegistered>): Observable<never> =>
                handleRegisteredRegularError$(error, caught)
            )
          )
      )
    );

const registeredRegularValidation = (transfer: unknown): RegularRegistered =>
  fpPipe(
    transfer,
    externalTypeCheckFor<RegularRegistered>(regularRegisteredCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: RegularRegistered): RegularRegistered => validatedTransfer
    )
  );

const handleRegisteredRegularError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<RegularRegistered>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<RegularRegistered> => caught);
  }
};

/*export const validatedRegisterRegularAction$ =
  (http: HttpClient): RegisterRegularAction =>
  (regular: Regular): Observable<RegularRegistered> =>
    fpPipe(
      regularPassengerCodec.decode(regular),
      fold(
        (): Observable<never> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleRegisterRegularError$)),
        (validatedTransfer: Regular): Observable<RegularRegistered> =>
          http.post(registerRegularUrl(), validatedTransfer).pipe(catchError(handleRegisterRegularError$))
      )
    );*/
