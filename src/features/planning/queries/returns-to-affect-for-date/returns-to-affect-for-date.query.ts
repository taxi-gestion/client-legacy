import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { toPlace } from '@features/common/place';
import { ReturnsToAffectForDateQuery, ReturnToAffectForDate } from '../../providers';

export type ReturnsToAffectTransfer = {
  id: string;
  client: string;
  datetime: string;
  departure: string;
  destination: string;
  planning: string | undefined;
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
      client: fare.client,
      datetime: fare.datetime,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      departure: toPlace(JSON.parse(fare.departure)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      destination: toPlace(JSON.parse(fare.destination)),
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: 'return-to-affect'
    })
  );

export const returnsToAffectForDateQuery$ =
  (httpClient: HttpClient): ReturnsToAffectForDateQuery =>
  (date: string): Observable<ReturnToAffectForDate[]> =>
    httpClient.get<ReturnsToAffectTransfer[]>(`/api/returns-to-affect-for-date/${date}`).pipe(map(toReturnsToAffectForDate));
