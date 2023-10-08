import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ScheduleFareAction } from '../providers';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { FaresScheduled, ToSchedule } from '@definitions';
import { externalTypeCheckFor, fareScheduledCodec, toScheduleCodec } from '@codecs';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const scheduleFareUrl = (): string => `/api/fare/schedule`;

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: ToSchedule): Observable<FaresScheduled> =>
    fpipe(
      toScheduleCodec.decode(fareToSchedule),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToSchedule): Observable<FaresScheduled> =>
          http.post<unknown>(scheduleFareUrl(), validatedTransfer).pipe(
            map(scheduledFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<FaresScheduled>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const scheduledFareAndReturnValidation = (transfer: unknown): FaresScheduled =>
  fpipe(
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
