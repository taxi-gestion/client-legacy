import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PredictRecurrenceQuery } from '../../providers';

const predictRecurrenceUrl = (): string => `https://taxi-gestion.com/api/predict-recurrence`;

const handlePredictRecurrenceError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const predictRecurrenceQuery$ =
  (http: HttpClient): PredictRecurrenceQuery =>
  (query: string): Observable<object> =>
    http
      .post(predictRecurrenceUrl(), {
        query
      })
      .pipe(catchError(handlePredictRecurrenceError$()));
