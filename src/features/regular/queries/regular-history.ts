import { HttpClient } from '@angular/common/http';
import { RegularHistoryQuery } from '../providers';
import { Observable } from 'rxjs';
import { RegularHistory } from '../../../definitions';

export const regularHistoryQuery$ =
  (httpClient: HttpClient): RegularHistoryQuery =>
  (id: string): Observable<RegularHistory> =>
    httpClient.get<RegularHistory>(`/api/regular/history/${id}`);
