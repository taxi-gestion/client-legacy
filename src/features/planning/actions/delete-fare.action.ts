import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DeleteFareAction } from '../providers';
import { FaresDeleted } from '@definitions';
import { ValidationFailedAfterApiCallError } from '../errors';
import { pipe as fpPipe } from 'fp-ts/function';
import { externalTypeCheckFor, faresDeletedCodec } from '@codecs';
import { fold } from 'fp-ts/Either';

const deleteFareUrl = (fareId: string): string => `/api/fare/delete/${fareId}`;

export const validatedDeleteFareAction$ =
  (httpClient: HttpClient): DeleteFareAction =>
  (fareId: string): Observable<FaresDeleted> =>
    httpClient.delete<unknown>(deleteFareUrl(fareId)).pipe(
      map(deletedFareAndReturnValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<FaresDeleted>): Observable<never> =>
          handleDeletedFareAndReturnError$(error, caught)
      )
    );

const handleDeletedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<FaresDeleted>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<FaresDeleted> => caught);
  }
};

const deletedFareAndReturnValidation = (transfer: unknown): FaresDeleted =>
  fpPipe(
    transfer,
    externalTypeCheckFor<FaresDeleted>(faresDeletedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: FaresDeleted): FaresDeleted => validatedTransfer
    )
  );
