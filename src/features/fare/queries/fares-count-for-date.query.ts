import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { externalTypeCheckFor, faresCountCodec } from '@codecs';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError } from '@features/common/form-validation';
import { FaresCountForDateQuery } from '../providers';
import { FaresCount } from '../../../definitions';

export const faresCountForDateQuery$ =
  (httpClient: HttpClient): FaresCountForDateQuery =>
  (date: string): Observable<FaresCount> =>
    httpClient.get<unknown>(`/api/fare/count/${date}`).pipe(
      map(faresCountValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<FaresCount>): Observable<never> =>
          handleFaresCountForDateError$(error, caught)
      )
    );

const handleFaresCountForDateError$ = (error: Error | HttpErrorResponse, caught: Observable<FaresCount>): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<FaresCount> => caught);
  }
};

const faresCountValidation = (transfer: unknown): FaresCount =>
  fpipe(
    transfer,
    externalTypeCheckFor<FaresCount>(faresCountCodec),
    fold(
      // TODO Share error reporter between projects
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: FaresCount): FaresCount => validatedTransfer
    )
  );
