import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PlaceTransfer } from '@features/common/place';
import { FareForDate, FaresForDateQuery } from '../../providers';

export type FareTransfer = {
  client: string;
  creator: string;
  datetime: string;
  departure: PlaceTransfer;
  destination: PlaceTransfer;
  distance: string;
  planning: string;
  duration: string;
  kind: 'one-way' | 'outward' | 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'scheduled';
};

const toFaresForDate = (fares: FareTransfer[]): FareForDate[] =>
  fares.map(
    (fare: FareTransfer): FareForDate => ({
      client: fare.client,
      creator: fare.creator,
      datetime: fare.datetime,
      departure: fare.departure,
      destination: fare.destination,
      distance: fare.distance,
      duration: fare.duration,
      kind: fare.kind,
      nature: fare.nature,
      phone: fare.phone,
      planning: fare.planning,
      status: fare.status
    })
  );

export const faresForDateQuery$ =
  (httpClient: HttpClient): FaresForDateQuery =>
  (date: string): Observable<FareForDate[]> =>
    httpClient.get<FareTransfer[]>(`/api/fares-for-date/${date}`).pipe(map(toFaresForDate));
