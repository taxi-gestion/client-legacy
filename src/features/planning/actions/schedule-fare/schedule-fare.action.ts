import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { FareToScheduleTransfer, ScheduleFareAction } from '../../providers';

const scheduleFareUrl = (): string => `https://taxi-gestion.com/api/schedule-fare`;

const handleScheduleFareError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const scheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: FareToScheduleTransfer): Observable<object> =>
    http.post(scheduleFareUrl(), fareToSchedule).pipe(catchError(handleScheduleFareError$()));
