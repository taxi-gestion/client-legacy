import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchPassengerQuery } from '../../providers';
import { Passenger } from '@domain';

export const searchPassengersQuery$ =
  (httpClient: HttpClient): SearchPassengerQuery =>
  (search: string): Observable<Passenger[]> =>
    httpClient.get<Passenger[]>(`/api/list-passengers`).pipe(map(sortByProximity(search)));

const sortByProximity =
  (search: string) =>
  (passengers: Passenger[]): Passenger[] =>
    passengers.sort(
      (passengerA: Passenger, passengerB: Passenger): number =>
        calculateScore(passengerB.passenger, search) - calculateScore(passengerA.passenger, search)
    );

const calculateScore = (text: string, searchTerm: string): number => {
  const index: number = text.indexOf(searchTerm);
  if (index === -1) {
    return 0;
  }
  // Assign higher scores to matches that occur at the beginning of the text
  return 1 / (index + 1);
};
