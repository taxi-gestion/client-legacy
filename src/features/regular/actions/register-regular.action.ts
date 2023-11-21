import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterRegularAction } from '../providers';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedOnApiResult, ValidationFailedBeforeApiCall } from '@features/common/form-validation';
import { Regular, RegisterRegular } from '@definitions';
import { externalTypeCheckFor, regularCodec, regularRegisteredCodec } from '@codecs';

const registerRegularUrl = (): string => `/api/regular/register`;

export const validatedRegisterRegularAction$ =
  (http: HttpClient): RegisterRegularAction =>
  (regular: Regular): Observable<RegisterRegular> =>
    fpipe(
      regularCodec.decode(regular),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCall()),
        (validatedTransfer: Regular): Observable<RegisterRegular> =>
          http.post<unknown>(registerRegularUrl(), validatedTransfer).pipe(
            map(registeredRegularValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<RegisterRegular>): Observable<never> =>
                handleRegisteredRegularError$(error, caught)
            )
          )
      )
    );

const registeredRegularValidation = (transfer: unknown): RegisterRegular =>
  fpipe(
    transfer,
    externalTypeCheckFor<RegisterRegular>(regularRegisteredCodec),
    fold(
      (): never => {
        throw new ValidationFailedOnApiResult(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: RegisterRegular): RegisterRegular => validatedTransfer
    )
  );

const handleRegisteredRegularError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<RegisterRegular>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<RegisterRegular> => caught);
  }
};
