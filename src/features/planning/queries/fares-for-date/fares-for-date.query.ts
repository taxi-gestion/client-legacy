import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduledFaresForDateQuery } from '../../providers';
import { Scheduled } from '@domain';

/*const toFaresForDate = (fares: Scheduled[]): Scheduled[] =>
  fares.map(
    (fare: FareTransfer): Scheduled => ({
      passenger: fare.passenger,
      creator: fare.creator,
      datetime: fare.datetime,
      departure: fare.departure,
      destination: fare.destination,
      distance: fare.distance,
      duration: fare.duration,
      kind: fare.kind,
      nature: fare.nature,
      phone: fare.phone,
      driver: fare.driver,
      status: fare.status
    })
  );*/

export const faresForDateQuery$ =
  (httpClient: HttpClient): ScheduledFaresForDateQuery =>
  (date: string): Observable<Scheduled[]> =>
    httpClient.get<Scheduled[]>(`/api/fares-for-date/${date}`);
