import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { Entity, SubcontractFare, ToSubcontracted } from '@definitions';
import { externalTypeCheckFor, faresSubcontractedCodec, fareToSubcontractCodec } from '@codecs';
import { SubcontractFareAction } from '../providers';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const subcontractFareUrl = (): string => `/api/fare/subcontract`;

export const validatedSubcontractFareAction$ =
  (http: HttpClient): SubcontractFareAction =>
  (fareToSubcontract: Entity & ToSubcontracted): Observable<SubcontractFare> =>
    fpipe(
      fareToSubcontractCodec.decode(fareToSubcontract),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToSubcontracted): Observable<SubcontractFare> =>
          http.post<unknown>(subcontractFareUrl(), validatedTransfer).pipe(
            map(subcontractedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<SubcontractFare>): Observable<never> =>
                handleSubcontractedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const subcontractedFareAndReturnValidation = (transfer: unknown): SubcontractFare =>
  fpipe(
    transfer,
    externalTypeCheckFor<SubcontractFare>(faresSubcontractedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: SubcontractFare): SubcontractFare => validatedTransfer
    )
  );

const handleSubcontractedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<SubcontractFare>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<SubcontractFare> => caught);
  }
};
