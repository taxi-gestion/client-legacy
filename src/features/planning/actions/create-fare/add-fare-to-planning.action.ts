import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { FareToAddToPlanning, AddFareToPlanningAction } from '../../providers';

const addFareToPlanningUrl = (): string => `https://taxi-gestion.com/api/add-fare-to-plannning`;

const handleAddFareToPlanningError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const addFareToPlanningAction$ =
  (http: HttpClient): AddFareToPlanningAction =>
  (fareToAddToPlanning: FareToAddToPlanning): Observable<object> =>
    http.post(addFareToPlanningUrl(), fareToAddToPlanning).pipe(catchError(handleAddFareToPlanningError$()));
