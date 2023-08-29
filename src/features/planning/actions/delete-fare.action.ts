import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { DeleteFareAction } from '../providers';
import { Entity, Pending, Scheduled } from '@domain';
import { ValidationFailedAfterApiCallError } from '../errors';
import { pipe as fpPipe } from 'fp-ts/function';
import { externalTypeCheckFor, fareAndOptionalPendingCodec } from '@codecs';
import { fold } from 'fp-ts/Either';

const deleteFareUrl = (fareId: string): string => `https://taxi-gestion.com/api/delete-fare/${fareId}`;

export const validatedDeleteFareAction$ =
  (httpClient: HttpClient): DeleteFareAction =>
  (fareId: string): Observable<[Entity & Scheduled, (Entity & Pending)?]> =>
    httpClient.delete<unknown>(deleteFareUrl(fareId)).pipe(
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,no-console,@typescript-eslint/typedef
      tap((x) => console.log('delete raw return', x)),
      map(deletedFareAndReturnValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<[Entity & Scheduled, (Entity & Pending)?]>): Observable<never> =>
          handleDeletedFareAndReturnError$(error, caught)
      )
    );

const handleDeletedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<[Entity & Scheduled, (Entity & Pending)?]>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<[Entity & Scheduled, (Entity & Pending)?]> => caught);
  }
};

const deletedFareAndReturnValidation = (transfer: unknown): [Entity & Scheduled, (Entity & Pending)?] =>
  fpPipe(
    transfer,
    extractRows,
    externalTypeCheckFor<[Entity & Scheduled, (Entity & Pending)?]>(fareAndOptionalPendingCodec),
    fold(
      // TODO Share error reporter between projects
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: [Entity & Scheduled, (Entity & Pending)?]): [Entity & Scheduled, (Entity & Pending)?] =>
        validatedTransfer
    )
  );

// TODO Remove ASAP
const extractRows = (transfer: unknown): unknown => [
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (transfer as { rows: object[] }[])[0]!.rows[0]!,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-non-null-assertion
  ...[(transfer as { rows: object[] }[])[1] === undefined ? [] : (transfer as { rows: object[] }[])[1]!.rows[0]!]
];
