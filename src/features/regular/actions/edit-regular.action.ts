import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { Entity, RegularEdited, Regular } from '@definitions';
import { externalTypeCheckFor, regularEntityCodec, regularEditedCodec } from '@codecs';
import { EditRegularAction } from '../providers';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const editRegularUrl = (): string => `/api/regular/edit`;

export const validatedEditRegularAction$ =
  (http: HttpClient): EditRegularAction =>
  (regularToEdit: Entity & Regular): Observable<RegularEdited> =>
    fpipe(
      regularEntityCodec.decode(regularToEdit),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: Entity & Regular): Observable<RegularEdited> =>
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
  fpipe(
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
