import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { pipe as fpipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { Entity, EditScheduled, ToScheduledEdited } from '@definitions';
import { externalTypeCheckFor, scheduledToEditCodec, scheduledEditedCodec } from '@codecs';
import { EditScheduledAction } from '../providers';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

const editScheduledUrl = (): string => `/api/fare/edit`;

export const validatedEditScheduledAction$ =
  (http: HttpClient): EditScheduledAction =>
  (scheduledToEdit: Entity & ToScheduledEdited): Observable<EditScheduled> =>
    fpipe(
      scheduledToEditCodec.decode(scheduledToEdit),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: ToScheduledEdited): Observable<EditScheduled> =>
          http.post<unknown>(editScheduledUrl(), validatedTransfer).pipe(
            map(editedFareAndReturnValidation),
            catchError(
              (error: Error | HttpErrorResponse, caught: Observable<EditScheduled>): Observable<never> =>
                handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const editedFareAndReturnValidation = (transfer: unknown): EditScheduled =>
  fpipe(
    transfer,
    externalTypeCheckFor<EditScheduled>(scheduledEditedCodec),
    fold(
      (): never => {
        throw new ValidationFailedAfterApiCallError(`Faudrait mettre le HttpReporter...`);
      },
      (validatedTransfer: EditScheduled): EditScheduled => validatedTransfer
    )
  );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<EditScheduled>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<EditScheduled> => caught);
  }
};
