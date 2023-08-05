import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AffectReturnAction } from '../../providers';
import { ReturnToAffectToScheduled } from '@domain';

const affectReturnUrl = (): string => `https://taxi-gestion.com/api/affect-return`;

const handleAffectReturnError$ =
  () =>
  (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    switch (errorResponse.error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const affectReturnAction$ =
  (http: HttpClient): AffectReturnAction =>
  (returnToAffect: ReturnToAffectToScheduled): Observable<object> =>
    http.post(affectReturnUrl(), returnToAffect).pipe(catchError(handleAffectReturnError$()));
