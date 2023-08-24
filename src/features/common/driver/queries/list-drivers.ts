import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListDriversQuery } from '../providers';
import { Driver, Entity } from '@domain';

export const listDriversQuery$ =
  (httpClient: HttpClient): ListDriversQuery =>
  (): Observable<(Driver & Entity)[]> =>
    httpClient.get<(Driver & Entity)[]>(`/api/list-drivers`);
