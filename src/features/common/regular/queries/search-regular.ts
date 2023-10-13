import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRegularQuery } from '../providers';
import { Entity, Regular } from '@definitions';

export const searchRegularsQuery$ =
  (httpClient: HttpClient): SearchRegularQuery =>
  (search: string): Observable<(Entity & Regular)[]> =>
    httpClient.get<(Entity & Regular)[]>(`/api/regular/search/${search}`);
