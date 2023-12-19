import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { AllocateUnassigned, ToUnassigned } from '@definitions';
import { externalTypeCheckFor, unassignedAllocatedCodec } from '@codecs';
import { AllocateUnassignedAction } from '../providers';
import { ValidationFailedOnApiResult } from '@features/common/form-validation';

const allocateUnassignedUrl = (): string => `/api/fare/allocate-unassigned`;

export const allocateUnassignedAction$ =
  (http: HttpClient): AllocateUnassignedAction =>
  (unassignedToAllocate: ToUnassigned): Observable<AllocateUnassigned> =>
    http.post<unknown>(allocateUnassignedUrl(), unassignedToAllocate).pipe(
      map(unassignedFareAndReturnValidation),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<AllocateUnassigned>): Observable<never> =>
          handleUnassignedFareAndReturnError$(error, caught)
      )
    );

const unassignedFareAndReturnValidation = (transfer: unknown): AllocateUnassigned =>
  fpipe(
    transfer,
    externalTypeCheckFor<AllocateUnassigned>(unassignedAllocatedCodec),
    fold(
      (): never => {
        throw new ValidationFailedOnApiResult(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: AllocateUnassigned): AllocateUnassigned => validatedTransfer
    )
  );

const handleUnassignedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<AllocateUnassigned>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<AllocateUnassigned> => caught);
  }
};
