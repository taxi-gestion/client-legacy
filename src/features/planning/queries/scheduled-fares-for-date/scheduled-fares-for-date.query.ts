import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduledFaresForDateQuery } from '../../providers';
import { Entity, Scheduled } from '@domain';

export const faresForDateQuery$ =
  (httpClient: HttpClient): ScheduledFaresForDateQuery =>
  (date: string): Observable<(Entity & Scheduled)[]> =>
    httpClient.get<(Entity & Scheduled)[]>(`/api/scheduled-fares-for-date/${date}`);
