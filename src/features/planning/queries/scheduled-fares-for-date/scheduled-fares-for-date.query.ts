import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduledFaresForDateQuery } from '../../providers';
import { Scheduled } from '@domain';

export const faresForDateQuery$ =
  (httpClient: HttpClient): ScheduledFaresForDateQuery =>
  (date: string): Observable<Scheduled[]> =>
    httpClient.get<Scheduled[]>(`/api/scheduled-fares-for-date/${date}`);
