import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PredictRecurrenceAction } from '../../providers';

/*const predictRecurrenceUrl = (): string => `https://taxi-gestion.com/api/predict-recurrence`;

const handlePredictRecurrenceError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };*/

export const predictRecurrenceAction$ =
  (_http: HttpClient): PredictRecurrenceAction =>
  (_query: string): Observable<object> =>
    of({
      query: 'tous les premiers vendredi de chaque mois',
      recurrence: '0 14 * * 5#1'
    });
//http.post(predictRecurrenceUrl(), query).pipe(catchError(handlePredictRecurrenceError$()));
