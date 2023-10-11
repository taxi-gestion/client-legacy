import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Entity, Pending } from '@definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { externalTypeCheckFor, pendingReturnsCodec } from '@codecs';
import { fold } from 'fp-ts/Either';
import { PendingReturnsForDateQuery } from '../providers';
import { ValidationFailedAfterApiCallError } from '@features/common/form-validation';

export const validatedPendingReturnsForDateQuery$ =
  (httpClient: HttpClient): PendingReturnsForDateQuery =>
  (date: string): Observable<(Entity & Pending)[]> =>
    httpClient.get<unknown>(`/api/pending/${date}`).pipe(
      map(pendingReturnsValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<(Entity & Pending)[]>): Observable<never> =>
          handlePendingReturnsForDateError$(error, caught)
      )
    );

const handlePendingReturnsForDateError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<(Entity & Pending)[]>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<(Entity & Pending)[]> => caught);
  }
};

const pendingReturnsValidation = (transfer: unknown): (Entity & Pending)[] =>
  fpipe(
    transfer,
    externalTypeCheckFor<(Entity & Pending)[]>(pendingReturnsCodec),
    fold(
      // TODO Share error reporter between projects
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: (Entity & Pending)[]): (Entity & Pending)[] => validatedTransfer
    )
  );
