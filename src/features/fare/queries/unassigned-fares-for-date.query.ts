import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Entity, Unassigned } from '@definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { externalTypeCheckFor, unassignedFaresCodec } from '@codecs';
import { fold } from 'fp-ts/Either';
import { ValidationFailedOnApiResult } from '@features/common/form-validation';
import { UnassignedFaresForDateQuery } from '../providers';

export const unassignedFaresForDateQuery$ =
  (httpClient: HttpClient): UnassignedFaresForDateQuery =>
  (date: string): Observable<(Entity & Unassigned)[]> =>
    httpClient.get<unknown>(`/api/unassigned/${date}`).pipe(
      map(unassignedFaresValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<(Entity & Unassigned)[]>): Observable<never> =>
          handleUnassignedFaresForDateError$(error, caught)
      )
    );

const handleUnassignedFaresForDateError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<(Entity & Unassigned)[]>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<(Entity & Unassigned)[]> => caught);
  }
};

const unassignedFaresValidation = (transfer: unknown): (Entity & Unassigned)[] =>
  fpipe(
    transfer,
    externalTypeCheckFor<(Entity & Unassigned)[]>(unassignedFaresCodec),
    fold(
      // TODO Share error reporter between projects
      (): never => {
        throw new ValidationFailedOnApiResult(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: (Entity & Unassigned)[]): (Entity & Unassigned)[] => validatedTransfer
    )
  );
