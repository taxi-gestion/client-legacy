import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchDriverQuery } from '../providers';
import { Driver, Entity } from '@definitions';

export const listDriversQuery$ =
  (httpClient: HttpClient): SearchDriverQuery =>
  (search: string): Observable<(Driver & Entity)[]> =>
    httpClient.get<(Driver & Entity)[]>(`/api/driver/list`).pipe(map(filterByterm(search)));

const filterByterm =
  (search: string) =>
  (drivers: (Driver & Entity)[]): (Driver & Entity)[] =>
    drivers.filter((driver: Driver & Entity): boolean => driver.identifier.toLowerCase().includes(search.toLowerCase()));
