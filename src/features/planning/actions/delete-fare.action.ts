import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeleteFareAction } from '../providers';
import { Entity, Pending, Scheduled } from '@domain';

const deleteFareUrl = (fareId: string): string => `https://taxi-gestion.com/api/delete-fare/${fareId}`;

/*const handleDeleteFareError$ =
  () =>
  (errorResponse: Error | HttpErrorResponse, caught: Observable<object>): Observable<object> => {
    if (errorResponse instanceof ValidationFailedBeforeApiCallError) return throwError((): Error => errorResponse);

    switch ((errorResponse as HttpErrorResponse).error.__type) {
      default:
        return throwError((): Observable<object> => caught);
    }
  };*/

/*export const validatedDeleteFareAction$ =
  (http: HttpClient): DeleteFareAction =>
  (fareToSchedule: FareToSchedule): Observable<object> =>
    fpPipe(
      fareToScheduleCodec.decode(fareToSchedule),
      fold(
        (): Observable<object> =>
          throwError((): Error => new ValidationFailedBeforeApiCallError()).pipe(catchError(handleDeleteFareError$())),
        (validatedTransfer: FareToSchedule): Observable<object> =>
          http.post(deleteFareUrl(), validatedTransfer).pipe(catchError(handleDeleteFareError$()))
      )
    );*/

export const deleteFareAction$ =
  (httpClient: HttpClient): DeleteFareAction =>
  (fareId: string): Observable<[Entity & Scheduled, (Entity & Pending)?]> =>
    httpClient.delete<[Entity & Scheduled, (Entity & Pending)?]>(deleteFareUrl(fareId), {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json'
      }
    }); /*.pipe(catchError(handleDeleteFareError$()));*/
