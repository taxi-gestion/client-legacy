import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchPassengerQuery } from '../../providers';
import { Passenger } from '@domain';

export const searchPassengersQuery$ =
  (httpClient: HttpClient): SearchPassengerQuery =>
  (_search: string): Observable<Passenger[]> =>
    httpClient.get<Passenger[]>(`/api/list-passengers`);
