import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchDriverQuery } from '../providers';
import { Driver, Entity } from '@domain';

export const listDriversQuery$ =
  (httpClient: HttpClient): SearchDriverQuery =>
  (search: string): Observable<(Driver & Entity)[]> =>
    httpClient.get<(Driver & Entity)[]>(`/api/list-drivers`).pipe(map(filterByterm(search)));

const filterByterm =
  (search: string) =>
  (passengers: (Driver & Entity)[]): (Driver & Entity)[] =>
    passengers.filter((passenger: Driver & Entity): boolean =>
      passenger.identifier.toLowerCase().includes(search.toLowerCase())
    );

/*
const sortByProximity =
  (search: string) =>
  (drivers: (Driver & Entity)[]): (Driver & Entity)[] =>
    drivers.sort(
      (driverA: Driver & Entity, driverB: Driver & Entity): number =>
        calculateScore(driverB.identifier, search) - calculateScore(driverA.identifier, search)
    );

const calculateScore = (text: string, searchTerm: string): number => {
  const index: number = text.indexOf(searchTerm);
  if (index === -1) {
    return 0;
  }
  // Assign higher scores to matches that occur at the beginning of the text
  return 1 / (index + 1);
};
*/
