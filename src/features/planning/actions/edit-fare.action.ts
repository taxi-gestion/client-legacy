import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError, ValidationFailedBeforeApiCallError } from '../errors';
import { Entity, FareToEdit, Pending, Scheduled } from '@domain';
import { externalTypeCheckFor, fareToEditCodec, scheduledFareAndOptionalPendingReturnCodec } from '@codecs';
import { EditFareAction } from '../providers';

const editFareUrl = (): string => `/api/edit-fare`;

export const validatedEditFareAction$ =
  (http: HttpClient): EditFareAction =>
  (fareToEdit: Entity & FareToEdit): Observable<[Entity & Scheduled, (Entity & Pending)?]> =>
    fpPipe(
      fareToEditCodec.decode(fareToEdit),
      fold(
        (): Observable<never> => throwError((): Error => new ValidationFailedBeforeApiCallError()),
        (validatedTransfer: FareToEdit): Observable<[Entity & Scheduled, (Entity & Pending)?]> =>
          http.post<unknown>(editFareUrl(), validatedTransfer).pipe(
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,no-console,@typescript-eslint/typedef
            tap((x) => console.log('edit raw return', x)),
            map(editedFareAndReturnValidation),
            catchError(
              (
                error: Error | HttpErrorResponse,
                caught: Observable<[Entity & Scheduled, (Entity & Pending)?]>
              ): Observable<never> => handleEditedFareAndReturnError$(error, caught)
            )
          )
      )
    );

const handleEditedFareAndReturnError$ = (
  error: Error | HttpErrorResponse,
  caught: Observable<[Entity & Scheduled, (Entity & Pending)?]>
): Observable<never> => {
  if (error instanceof ValidationFailedAfterApiCallError) return throwError((): Error => error);

  switch ((error as HttpErrorResponse).error.__type) {
    default:
      return throwError((): Observable<[Entity & Scheduled, (Entity & Pending)?]> => caught);
  }
};

const editedFareAndReturnValidation = (transfer: unknown): [Entity & Scheduled, (Entity & Pending)?] =>
  fpPipe(
    transfer,
    extractRows,
    externalTypeCheckFor<[Entity & Scheduled, (Entity & Pending)?]>(scheduledFareAndOptionalPendingReturnCodec),
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
