import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DeleteRegularAction } from '../providers';
import { Entity, DeleteRegular } from '@definitions';
import { ValidationFailedOnApiResult } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { externalTypeCheckFor, regularDeletedCodec } from '@codecs';
import { fold } from 'fp-ts/Either';

const deleteRegularUrl = (regular: Entity): string => `/api/regular/delete/${regular.id}`;

export const validatedDeleteRegularAction$ =
  (httpClient: HttpClient): DeleteRegularAction =>
  (regularToDelete: Entity): Observable<DeleteRegular> =>
    httpClient.delete<unknown>(deleteRegularUrl(regularToDelete)).pipe(
      map(deletedRegularAndReturnValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<DeleteRegular>): Observable<never> =>
          handleDeletedRegularAndReturnError$(error, caught)
      )
    );

const handleDeletedRegularAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<DeleteRegular>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<DeleteRegular> => caught);
  }
};

const deletedRegularAndReturnValidation = (transfer: unknown): DeleteRegular =>
  fpipe(
    transfer,
    externalTypeCheckFor<DeleteRegular>(regularDeletedCodec),
    fold(
      (): never => {
        throw new ValidationFailedOnApiResult(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: DeleteRegular): DeleteRegular => validatedTransfer
    )
  );
