import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver, Entity } from '@definitions';
import { ListDriversQuery } from '@features/common/driver';

export const listDriversQuery$ =
  (httpClient: HttpClient): ListDriversQuery =>
  (): Observable<(Driver & Entity)[]> =>
    httpClient.get<(Driver & Entity)[]>(`/api/driver/list`);
