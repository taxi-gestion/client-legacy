import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SchedulePendingAction } from '../providers';
import { Entity, PendingScheduled, ReturnDrive } from '@definitions';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { externalTypeCheckFor, pendingScheduledCodec, returnDriveCodec } from '@codecs';

const schedulePendingUrl = (): string => `/api/pending/schedule`;

export const validatedSchedulePendingAction$ =
  (http: HttpClient): SchedulePendingAction =>
  (pendingReturn: Entity & ReturnDrive): Observable<PendingScheduled> =>
    fpPipe(
      returnDriveCodec.decode(pendingReturn),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ReturnDrive): Observable<PendingScheduled> =>
          http.post<unknown>(schedulePendingUrl(), validatedTransfer).pipe(
            map(editedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<PendingScheduled>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const editedFareAndReturnValidation = (transfer: unknown): PendingScheduled =>
  fpPipe(
    transfer,
    externalTypeCheckFor<PendingScheduled>(pendingScheduledCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: PendingScheduled): PendingScheduled => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<PendingScheduled>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<PendingScheduled> => caught);
  }
};
