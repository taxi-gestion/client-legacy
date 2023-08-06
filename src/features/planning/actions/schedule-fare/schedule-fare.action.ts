import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ScheduleFareAction } from '../../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedBeforeApiCallError } from '../../errors';
import { FareToSchedule } from '@domain';
import { fareToScheduleCodec } from '@codecs';

const scheduleFareUrl = (): string => `https://taxi-gestion.com/api/schedule-fare`;

const handleScheduleFareError$ =
  () =>
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: FareToSchedule): Observable<object> =>
    fpPipe(
      fareToScheduleCodec.decode(fareToSchedule),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleScheduleFareError$())),
        (validatedTransfer: FareToSchedule): Observable<object> =>
          http.post(scheduleFareUrl(), validatedTransfer).pipe(catchError(handleScheduleFareError$()))
      )
    );
