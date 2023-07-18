import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PredictRecurrenceAction } from '../../providers';

const predictRecurrenceUrl = (): string => `https://taxi-gestion.com/api/predict-recurrence`;

const handlePredictRecurrenceError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const predictRecurrenceAction$ =
  (http: HttpClient): PredictRecurrenceAction =>
  (query: string): Observable<object> =>
    http.post(predictRecurrenceUrl(), query).pipe(catchError(handlePredictRecurrenceError$()));
