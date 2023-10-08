import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DeleteRegularAction } from '../providers';
import { Entity, RegularDeleted } from '@definitions';
import { ValidationFailedAfterApiCallError } from '../errors';
import { pipe as fpipe } from 'fp-ts/function';
import { externalTypeCheckFor, regularDeletedCodec } from '@codecs';
import { fold } from 'fp-ts/Either';

const deleteRegularUrl = (regular: Entity): string => `/api/regular/delete/${regular.id}`;

export const validatedDeleteRegularAction$ =
  (httpClient: HttpClient): DeleteRegularAction =>
  (regularToDelete: Entity): Observable<RegularDeleted> =>
    httpClient.delete<unknown>(deleteRegularUrl(regularToDelete)).pipe(
      map(deletedRegularAndReturnValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<RegularDeleted>): Observable<never> =>
          handleDeletedRegularAndReturnError$(error, caught)
      )
    );

const handleDeletedRegularAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<RegularDeleted>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<RegularDeleted> => caught);
  }
};

const deletedRegularAndReturnValidation = (transfer: unknown): RegularDeleted =>
  fpipe(
    transfer,
    externalTypeCheckFor<RegularDeleted>(regularDeletedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: RegularDeleted): RegularDeleted => validatedTransfer
    )
  );
