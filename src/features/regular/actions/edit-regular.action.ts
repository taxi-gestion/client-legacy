import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { Entity, EditRegular, Regular } from '@definitions';
import { externalTypeCheckFor, regularEntityCodec, regularEditedCodec } from '@codecs';
import { EditRegularAction } from '../providers';
import { ValidationFailedOnApiResult, ValidationFailedBeforeApiCall } from '@features/common/form-validation';

const editRegularUrl = (): string => `/api/regular/edit`;

export const validatedEditRegularAction$ =
  (http: HttpClient): EditRegularAction =>
  (regularToEdit: Entity & Regular): Observable<EditRegular> =>
    fpipe(
      regularEntityCodec.decode(regularToEdit),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCall()),
        (validatedTransfer: Entity & Regular): Observable<EditRegular> =>
          http.post<unknown>(editRegularUrl(), validatedTransfer).pipe(
            map(editedRegularAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<EditRegular>): Observable<never> =>
                handleEditedRegularAndReturnError$(error, caught)
            )
          )
      )
    );

const editedRegularAndReturnValidation = (transfer: unknown): EditRegular =>
  fpipe(
    transfer,
    externalTypeCheckFor<EditRegular>(regularEditedCodec),
    fold(
      (): never => {
        throw new ValidationFailedOnApiResult(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: EditRegular): EditRegular => validatedTransfer
    )
  );

const handleEditedRegularAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<EditRegular>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<EditRegular> => caught);
  }
};
