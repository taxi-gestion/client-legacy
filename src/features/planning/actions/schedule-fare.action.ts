import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ScheduleFareAction } from '../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { FaresScheduled, ToSchedule } from '@definitions';
import { externalTypeCheckFor, fareScheduledCodec, toScheduleCodec } from '@codecs';

const scheduleFareUrl = (): string => `/api/fare/schedule`;

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: ToSchedule): Observable<FaresScheduled> =>
    fpPipe(
      toScheduleCodec.decode(fareToSchedule),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToSchedule): Observable<FaresScheduled> =>
          http.post<unknown>(scheduleFareUrl(), validatedTransfer).pipe(
            map(editedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<FaresScheduled>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const editedFareAndReturnValidation = (transfer: unknown): FaresScheduled =>
  fpPipe(
    transfer,
    externalTypeCheckFor<FaresScheduled>(fareScheduledCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: FaresScheduled): FaresScheduled => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<FaresScheduled>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<FaresScheduled> => caught);
  }
};
