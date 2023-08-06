import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ScheduleReturnAction } from '../../providers';
import { Entity, ReturnToSchedule } from '@domain';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedBeforeApiCallError } from '../../errors';
import { returnToScheduleCodec } from '@codecs';

const scheduleReturnUrl = (): string => `https://taxi-gestion.com/api/schedule-return`;

const handleScheduleReturnError$ =
  () =>
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const validatedScheduleReturnAction$ =
  (http: HttpClient): ScheduleReturnAction =>
  (returnToSchedule: Entity & ReturnToSchedule): Observable<object> =>
    fpPipe(
      returnToScheduleCodec.decode(returnToSchedule),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleScheduleReturnError$())),
        (validatedTransfer: Entity & ReturnToSchedule): Observable<object> =>
          http.post(scheduleReturnUrl(), validatedTransfer).pipe(catchError(handleScheduleReturnError$()))
      )
    );
