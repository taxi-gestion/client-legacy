import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ScheduleReturnAction } from '../../providers';
import { ReturnToSchedule } from '@domain';
import { excess } from 'io-ts-excess';
import { literal as ioLiteral, number as ioNumber, string as ioString, type as ioType, Type } from 'io-ts';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedBeforeApiCallError } from '../../errors';

const scheduleReturnUrl = (): string => `https://taxi-gestion.com/api/schedule-return`;

const handleScheduleReturnError$ =
  () =>
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const validatedScheduleReturnAction$ =
  (http: HttpClient): ScheduleReturnAction =>
  (returnToSchedule: ReturnToSchedule): Observable<object> =>
    fpPipe(
      returnToScheduleTransferCodec.decode(returnToSchedule),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleScheduleReturnError$())),
        (validatedTransfer: ReturnToSchedule): Observable<object> =>
          http.post(scheduleReturnUrl(), validatedTransfer).pipe(catchError(handleScheduleReturnError$()))
      )
    );

export const returnToScheduleTransferCodec: Type<ReturnToSchedule> = excess(
  ioType({
    id: ioString,
    departure: ioType({
      context: ioString,
      label: ioString,
      location: ioType({
        latitude: ioNumber,
        longitude: ioNumber
      })
    }),
    destination: ioType({
      context: ioString,
      label: ioString,
      location: ioType({
        latitude: ioNumber,
        longitude: ioNumber
      })
    }),
    driver: ioString,
    datetime: ioString,
    duration: ioNumber,
    distance: ioNumber,
    kind: ioLiteral('two-way'),
    status: ioLiteral('return-to-schedule')
  })
);
