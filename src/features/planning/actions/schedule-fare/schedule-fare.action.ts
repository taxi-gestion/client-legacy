import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { FareToSchedule, ScheduleFareAction } from '../../providers';
import { keyof as ioKeyof, number as ioNumber, string as ioString, Type, type as ioType } from 'io-ts';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { excess } from 'io-ts-excess';
import { ValidationFailedBeforeApiCallError } from '../../errors';

const scheduleFareUrl = (): string => `https://taxi-gestion.com/api/schedule-fare`;

const handleScheduleFareError$ =
  () =>
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

//export const scheduleFareAction$ =
//  (http: HttpClient): ScheduleFareAction =>
//  (fareToSchedule: FareToSchedule): Observable<object> =>
//    http.post(scheduleFareUrl(), fareToSchedule).pipe(catchError(handleScheduleFareError$()));

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
  (fareToSchedule: FareToSchedule): Observable<object> =>
    fpPipe(
      fareToScheduleTransferCodec.decode(fareToSchedule),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleScheduleFareError$())),
        (validatedTransfer: FareToSchedule): Observable<object> =>
          http.post(scheduleFareUrl(), validatedTransfer).pipe(catchError(handleScheduleFareError$()))
      )
    );

export const fareToScheduleTransferCodec: Type<FareToSchedule> = excess(
  ioType({
    passenger: ioString,
    phone: ioString,
    datetime: ioString,
    departure: ioType({
      context: ioString,
      label: ioString,
      location: ioType({
        latitude: ioNumber,
        longitude: ioNumber
      })
    }),
    arrival: ioType({
      context: ioString,
      label: ioString,
      location: ioType({
        latitude: ioNumber,
        longitude: ioNumber
      })
    }),
    // eslint-disable-next-line @typescript-eslint/naming-convention,quote-props
    kind: ioKeyof({ 'one-way': null, 'two-way': null }),
    nature: ioKeyof({ medical: null, standard: null }),
    driver: ioString,
    duration: ioNumber,
    distance: ioNumber
  })
);
