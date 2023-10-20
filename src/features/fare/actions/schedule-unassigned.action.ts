import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Entity, ScheduleUnassigned, ToScheduled } from '@definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { externalTypeCheckFor, unassignedScheduledCodec, unassignedToScheduleCodec } from '@codecs';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';
import { ScheduleUnassignedAction } from '../providers';

const schedulePendingUrl = (): string => `/api/unassigned/schedule`;

export const scheduleUnassignedAction$ =
  (http: HttpClient): ScheduleUnassignedAction =>
  (unassignedToSchedule: Entity & ToScheduled): Observable<ScheduleUnassigned> =>
    fpipe(
      unassignedToScheduleCodec.decode(unassignedToSchedule),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: Entity & ToScheduled): Observable<ScheduleUnassigned> =>
          http.post<unknown>(schedulePendingUrl(), validatedTransfer).pipe(
            map(editedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<ScheduleUnassigned>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const editedFareAndReturnValidation = (transfer: unknown): ScheduleUnassigned =>
  fpipe(
    transfer,
    externalTypeCheckFor<ScheduleUnassigned>(unassignedScheduledCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: ScheduleUnassigned): ScheduleUnassigned => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<ScheduleUnassigned>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<ScheduleUnassigned> => caught);
  }
};
