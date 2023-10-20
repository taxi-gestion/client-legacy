import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SchedulePendingAction } from '../providers';
import { Entity, SchedulePending, PendingToScheduled } from '@definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { externalTypeCheckFor, pendingScheduledCodec, returnDriveCodec } from '@codecs';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const schedulePendingUrl = (): string => `/api/pending/schedule`;

export const validatedSchedulePendingAction$ =
  (http: HttpClient): SchedulePendingAction =>
  (pendingReturn: Entity & PendingToScheduled): Observable<SchedulePending> =>
    fpipe(
      returnDriveCodec.decode(pendingReturn),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: PendingToScheduled): Observable<SchedulePending> =>
          http.post<unknown>(schedulePendingUrl(), validatedTransfer).pipe(
            map(editedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<SchedulePending>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const editedFareAndReturnValidation = (transfer: unknown): SchedulePending =>
  fpipe(
    transfer,
    externalTypeCheckFor<SchedulePending>(pendingScheduledCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: SchedulePending): SchedulePending => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<SchedulePending>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<SchedulePending> => caught);
  }
};
