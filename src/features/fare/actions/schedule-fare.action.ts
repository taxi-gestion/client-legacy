import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ScheduleFareAction } from '../providers';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ScheduleScheduled, ToScheduled } from '@definitions';
import { externalTypeCheckFor, scheduleScheduledCodec, toScheduleCodec } from '@codecs';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const scheduleFareUrl = (): string => `/api/fare/schedule`;

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: ToScheduled): Observable<ScheduleScheduled> =>
    fpipe(
      toScheduleCodec.decode(fareToSchedule),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToScheduled): Observable<ScheduleScheduled> =>
          http.post<unknown>(scheduleFareUrl(), validatedTransfer).pipe(
            map(scheduledFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<ScheduleScheduled>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const scheduledFareAndReturnValidation = (transfer: unknown): ScheduleScheduled =>
  fpipe(
    transfer,
    externalTypeCheckFor<ScheduleScheduled>(scheduleScheduledCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: ScheduleScheduled): ScheduleScheduled => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<ScheduleScheduled>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<ScheduleScheduled> => caught);
  }
};
