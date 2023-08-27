import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {catchError, map, Observable, of, throwError} from 'rxjs';
//import { ScheduleFareAction } from '../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { ValidationFailedBeforeApiCallError } from '../errors';
import {Entity, FareToSchedule, Scheduled} from '@domain';
import { fareToScheduleCodec } from '@codecs';

type ScheduleFareAction = (fareToSchedule: FareToSchedule) => Observable<Error | Entity & Scheduled>;

const scheduleFareUrl = (): string => `https://taxi-gestion.com/api/schedule-fare`;

const handleScheduleFareError$ =
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<never> => {
    //if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };

export const validatedScheduleFareAction$ =
  (http: HttpClient): ScheduleFareAction =>
    (fareToSchedule: FareToSchedule): Observable<Error | Entity & Scheduled> =>
      fpPipe(
        fareToScheduleCodec.decode(fareToSchedule),
        fold(
          (): Observable<Error> =>
            of(new ValidationFailedBeforeApiCallError()),
          (validatedTransfer: FareToSchedule): Observable<Error | unknown> => fpPipe(

          ){
            const response: Observable<unknown> = http.post<HttpResponse<unknown>>(scheduleFareUrl(), validatedTransfer).pipe(
              map((response: HttpResponse<unknown>): unknown => response.body),
              catchError((error: Error, caught: Observable<Entity & Scheduled>): Observable<never> => handleScheduleFareError$(error, caught))
            )
              return response;
          }

        )
      );

const toScheduled = (response: Entity & Scheduled): Entity & Scheduled => {
  // Transform the response to an Entity & Scheduled object
  return response as unknown as Entity & Scheduled;
};

const request = (validatedTransfer: FareToSchedule): Observable<Error | unknown> => {
  const response: Observable<unknown> = http.post<HttpResponse<unknown>>(scheduleFareUrl(), validatedTransfer).pipe(
    map((response: HttpResponse<unknown>): unknown => response.body),
    catchError((error: Error, caught: Observable<Entity & Scheduled>): Observable<never> => handleScheduleFareError$(error, caught))
  )
  return response;
}

const validation
