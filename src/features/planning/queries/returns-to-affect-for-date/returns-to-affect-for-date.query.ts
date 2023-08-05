import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnsToAffectForDateQuery } from '../../providers';
import { Entity, ReturnToAffect } from '@domain';

/*export type ReturnsToAffectTransfer = {
  id: string;
  passenger: string;
  datetime: string;
  departure: PlaceTransfer;
  destination: PlaceTransfer;
  driver: string | undefined;
  kind: 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'return-to-affect';
};

const toReturnsToAffectForDate = (faresToSchedule: ReturnsToAffectTransfer[]): ReturnToAffectForDate[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  faresToSchedule.map(
    (fare: ReturnsToAffectTransfer): ReturnToAffectForDate => ({
      id: fare.id,
      passenger: fare.passenger,
      datetime: fare.datetime,
      departure: fare.departure,
      destination: fare.destination,
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      driver: fare.driver,
      status: 'return-to-affect'
    })
  );*/

export const returnsToAffectForDateQuery$ =
  (httpClient: HttpClient): ReturnsToAffectForDateQuery =>
  (date: string): Observable<Entity<ReturnToAffect>[]> =>
    httpClient.get<Entity<ReturnToAffect>[]>(`/api/returns-to-affect-for-date/${date}`);
