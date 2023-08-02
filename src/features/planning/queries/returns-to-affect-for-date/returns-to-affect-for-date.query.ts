import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReturnsToAffectForDate, ReturnsToAffectForDateQuery, ReturnToAffectForDate } from '@features/planning';
import { toPlace } from '@features/common/place';

export type ReturnsToAffectTransfer = {
  id: string;
  client: string;
  date: string;
  departure: string;
  destination: string;
  planning: string | undefined;
  kind: 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'return-to-affect';
  time: string | undefined;
};

const toReturnsToAffectForDate = (faresToSchedule: ReturnsToAffectTransfer[]): ReturnsToAffectForDate =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  faresToSchedule.map(
    (fare: ReturnsToAffectTransfer): ReturnToAffectForDate => ({
      id: fare.id,
      client: fare.client,
      date: fare.date,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      departure: toPlace(JSON.parse(fare.departure)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      destination: toPlace(JSON.parse(fare.destination)),
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: 'return-to-affect',
      time: fare.time
    })
  );

export const returnsToAffectForDateQuery$ =
  (httpClient: HttpClient): ReturnsToAffectForDateQuery =>
  (date: string): Observable<ReturnsToAffectForDate> =>
    httpClient.get<ReturnsToAffectTransfer[]>(`/api/returns-to-affect-for-date/${date}`).pipe(map(toReturnsToAffectForDate));
