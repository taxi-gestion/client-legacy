import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { Entity, FaresSubcontracted, ToSubcontract } from '@definitions';
import { externalTypeCheckFor, faresSubcontractedCodec, fareToSubcontractCodec } from '@codecs';
import { SubcontractFareAction } from '../providers';

const subcontractFareUrl = (): string => `/api/fare/subcontract`;

export const validatedSubcontractFareAction$ =
  (http: HttpClient): SubcontractFareAction =>
  (fareToSubcontract: Entity & ToSubcontract): Observable<FaresSubcontracted> =>
    fpPipe(
      fareToSubcontractCodec.decode(fareToSubcontract),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToSubcontract): Observable<FaresSubcontracted> =>
          http.post<unknown>(subcontractFareUrl(), validatedTransfer).pipe(
            map(subcontractedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<FaresSubcontracted>): Observable<never> =>
                handleSubcontractedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const subcontractedFareAndReturnValidation = (transfer: unknown): FaresSubcontracted =>
  fpPipe(
    transfer,
    externalTypeCheckFor<FaresSubcontracted>(faresSubcontractedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: FaresSubcontracted): FaresSubcontracted => validatedTransfer
    )
  );

const handleSubcontractedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<FaresSubcontracted>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<FaresSubcontracted> => caught);
  }
};
