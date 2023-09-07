import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRegularQuery } from '../../providers';
import { Entity, RegularDetails } from '@definitions';

export const searchRegularsQuery$ =
  (httpClient: HttpClient): SearchRegularQuery =>
  (search: string): Observable<(Entity & RegularDetails)[]> =>
    httpClient.get<(Entity & RegularDetails)[]>(`/api/regular/search/${search}`);
