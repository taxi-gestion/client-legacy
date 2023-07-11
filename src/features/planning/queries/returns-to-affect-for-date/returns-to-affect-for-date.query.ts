import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReturnsToAffectForDate, ReturnsToAffectForDateQuery, ReturnToAffectForDate } from '@features/planning';

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
  status: 'to-affect';
  time: string | undefined;
};

const toReturnsToAffectForDate = (faresToSchedule: ReturnsToAffectTransfer[]): ReturnsToAffectForDate =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  faresToSchedule.map(
    (fare: ReturnsToAffectTransfer): ReturnToAffectForDate => ({
      id: fare.id,
      client: fare.client,
      date: fare.date,
      departure: fare.departure,
      destination: fare.destination,
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: 'to-affect',
      time: fare.time
    })
  );

export const returnsToAffectForDateQuery$ =
  (httpClient: HttpClient): ReturnsToAffectForDateQuery =>
  (date: Date): Observable<ReturnsToAffectForDate> =>
    httpClient
      .get<ReturnsToAffectTransfer[]>(
        `/api/returns-to-affect-for-date/${new Date(
          `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(
            2,
            '0'
          )}`
        ).toISOString()}`
      )
      .pipe(map(toReturnsToAffectForDate));
