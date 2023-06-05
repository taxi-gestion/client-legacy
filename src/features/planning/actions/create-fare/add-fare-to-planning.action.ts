import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { FareToAddToPlanning, AddFareToPlanningAction } from '../../providers/actions/add-fare-to-planning.action.provider';

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
  (values: FareToAddToPlanning): Observable<object> =>
    http.post(addFareToPlanningUrl(), { ...values }).pipe(catchError(handleAddFareToPlanningError$()));
