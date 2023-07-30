import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FareForDate, FaresForDate, FaresForDateQuery } from '../../providers';
import { PlaceTransfer, toPlace } from '@features/place';

export type FareTransfer = {
  client: string;
  creator: string;
  date: string;
  departure: PlaceTransfer;
  destination: PlaceTransfer;
  distance: string;
  planning: string;
  duration: string;
  kind: 'one-way' | 'outward' | 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'scheduled';
  time: string;
};

const toFaresForDate = (fares: FareTransfer[]): FaresForDate =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  fares.map(
    (fare: FareTransfer): FareForDate => ({
      client: fare.client,
      creator: fare.creator,
      date: fare.date,
      departure: toPlace(fare.departure),
      destination: toPlace(fare.destination),
      distance: fare.distance,
      duration: fare.duration,
      kind: fare.kind,
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: fare.status,
      time: fare.time
    })
  );

export const faresForDateQuery$ =
  (httpClient: HttpClient): FaresForDateQuery =>
  (date: Date): Observable<FaresForDate> =>
    httpClient
      .get<FareTransfer[]>(
        `/api/fares-for-date/${new Date(
          `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(
            2,
            '0'
          )}`
        ).toISOString()}`
      )
      .pipe(map(toFaresForDate));
