import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  FaresToScheduleForDate,
  FaresToScheduleForDateQuery,
  FareToScheduleForDate
} from '../../providers/queries/fares-to-schedule-for-date.query.provider';

export type ReturnsToScheduleTransfer = {
  client: string;
  creator: string;
  date: string;
  departure: string;
  destination: string;
  distance: string;
  planning: string;
  duration: string;
  kind: 'one-way' | 'outward' | 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'scheduled';
  time: string;
};

const toFaresToScheduleForDate = (faresToSchedule: ReturnsToScheduleTransfer[]): FaresToScheduleForDate =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  faresToSchedule.map(
    (fare: ReturnsToScheduleTransfer): FareToScheduleForDate => ({
      client: fare.client,
      creator: fare.creator,
      date: fare.date,
      departure: fare.departure,
      destination: fare.destination,
      distance: fare.distance,
      duration: fare.duration,
      kind: 'return',
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: 'to-schedule',
      time: fare.time
    })
  );

export const faresToScheduleForDateQuery$ =
  (httpClient: HttpClient): FaresToScheduleForDateQuery =>
  (date: Date): Observable<FaresToScheduleForDate> =>
    httpClient
      .get<ReturnsToScheduleTransfer[]>(
        `/api/fares-to-schedule-for-date/${new Date(
          `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(
            2,
            '0'
          )}`
        ).toISOString()}`
      )
      .pipe(map(toFaresToScheduleForDate));
