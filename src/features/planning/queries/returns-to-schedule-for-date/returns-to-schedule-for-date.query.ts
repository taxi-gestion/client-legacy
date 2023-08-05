import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnsToScheduleForDateQuery } from '../../providers';
import { PendingReturnToSchedule } from '@domain';

/*export type ReturnsToScheduleTransfer = {
  id: string;
  passenger: string;
  datetime: string;
  departure: PlaceTransfer;
  destination: PlaceTransfer;
  driver: string | undefined;
  kind: 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'return-to-schedule';
};

const toReturnsToScheduleForDate = (faresToSchedule: ReturnsToScheduleTransfer[]): ReturnToScheduleForDate[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  faresToSchedule.map(
    (fare: ReturnsToScheduleTransfer): ReturnToScheduleForDate => ({
      id: fare.id,
      passenger: fare.passenger,
      datetime: fare.datetime,
      departure: fare.departure,
      destination: fare.destination,
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      driver: fare.driver,
      status: 'return-to-schedule'
    })
  );*/

export const returnsToScheduleForDateQuery$ =
  (httpClient: HttpClient): ReturnsToScheduleForDateQuery =>
  (date: string): Observable<PendingReturnToSchedule[]> =>
    httpClient.get<PendingReturnToSchedule[]>(`/api/returns-to-schedule-for-date/${date}`);
