import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { Entity, RegularEdited, RegularDetails } from '@definitions';
import { externalTypeCheckFor, regularDetailsEntityCodec, regularEditedCodec } from '@codecs';
import { EditRegularAction } from '../providers';

const editRegularUrl = (): string => `/api/regular/edit`;

export const validatedEditRegularAction$ =
  (http: HttpClient): EditRegularAction =>
  (regularToEdit: Entity & RegularDetails): Observable<RegularEdited> =>
    fpPipe(
      regularDetailsEntityCodec.decode(regularToEdit),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: Entity & RegularDetails): Observable<RegularEdited> =>
          http.post<unknown>(editRegularUrl(), validatedTransfer).pipe(
            map(editedRegularAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<RegularEdited>): Observable<never> =>
                handleEditedRegularAndReturnError$(error, caught)
            )
          )
      )
    );

const editedRegularAndReturnValidation = (transfer: unknown): RegularEdited =>
  fpPipe(
    transfer,
    externalTypeCheckFor<RegularEdited>(regularEditedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: RegularEdited): RegularEdited => validatedTransfer
    )
  );

const handleEditedRegularAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<RegularEdited>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<RegularEdited> => caught);
  }
};
