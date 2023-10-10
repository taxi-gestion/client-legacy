import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriverWithOrder } from '@definitions';
import { ListDriversWithOrderQuery } from '@features/common/driver';

export const listDriversWithOrderQuery$ =
  (httpClient: HttpClient): ListDriversWithOrderQuery =>
  (): Observable<DriverWithOrder[]> =>
    httpClient.get<DriverWithOrder[]>(`/api/driver/list-with-display-order`);
