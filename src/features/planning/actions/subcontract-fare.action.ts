import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { Entity, FareToSubcontract, Subcontracted } from '@domain';
import { externalTypeCheckFor, fareToSubcontractCodec, subcontractedFareCodec } from '@codecs';
import { SubcontractFareAction } from '../providers';

const subcontractFareUrl = (): string => `/api/subcontract-fare`;

export const validatedSubcontractFareAction$ =
  (http: HttpClient): SubcontractFareAction =>
  (fareToSubcontract: Entity & FareToSubcontract): Observable<Entity & Subcontracted> =>
    fpPipe(
      fareToSubcontractCodec.decode(fareToSubcontract),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: FareToSubcontract): Observable<Entity & Subcontracted> =>
          http.post<unknown>(subcontractFareUrl(), validatedTransfer).pipe(
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,no-console,@typescript-eslint/typedef
            tap((x) => console.log('subcontract raw return', x)),
            map(subcontractedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<Entity & Subcontracted>): Observable<never> =>
                handleSubcontractedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const handleSubcontractedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<Entity & Subcontracted>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<Entity & Subcontracted> => caught);
  }
};

const subcontractedFareAndReturnValidation = (transfer: unknown): Entity & Subcontracted =>
  fpPipe(
    transfer,
    extractRows,
    externalTypeCheckFor<Entity & Subcontracted>(subcontractedFareCodec),
    fold(
      // TODO Share error reporter between projects
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: Entity & Subcontracted): Entity & Subcontracted => validatedTransfer
    )
  );

// TODO Remove ASAP
const extractRows = (transfer: unknown): unknown => [
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (transfer as { rows: object[] }[])[0]!.rows[0]!,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-non-null-assertion
  ...[(transfer as { rows: object[] }[])[1] === undefined ? [] : (transfer as { rows: object[] }[])[1]!.rows[0]!]
];
