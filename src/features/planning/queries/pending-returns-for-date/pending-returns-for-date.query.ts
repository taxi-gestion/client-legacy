import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Pending } from '@domain';
import { PendingReturnsForDateQuery } from '../../providers';

export const pendingReturnsForDateQuery$ =
  (httpClient: HttpClient): PendingReturnsForDateQuery =>
  (date: string): Observable<(Entity & Pending)[]> =>
    httpClient.get<(Entity & Pending)[]>(`/api/pending-returns-for-date/${date}`);
