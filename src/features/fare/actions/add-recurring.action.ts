import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AddRecurringAction } from '../providers';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { AddRecurring, ToRecurring } from '@definitions';
import { externalTypeCheckFor, addRecurringCodec, toRecurringCodec } from '@codecs';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const addRecurringUrl = (): string => `/api/recurrence/add`;

export const validatedAddRecurringAction$ =
  (http: HttpClient): AddRecurringAction =>
  (recurringToAdd: ToRecurring): Observable<AddRecurring> =>
    fpipe(
      toRecurringCodec.decode(recurringToAdd),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToRecurring): Observable<AddRecurring> =>
          http.post<unknown>(addRecurringUrl(), validatedTransfer).pipe(
            map(scheduledFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<AddRecurring>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const scheduledFareAndReturnValidation = (transfer: unknown): AddRecurring =>
  fpipe(
    transfer,
    externalTypeCheckFor<AddRecurring>(addRecurringCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: AddRecurring): AddRecurring => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<AddRecurring>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<AddRecurring> => caught);
  }
};
