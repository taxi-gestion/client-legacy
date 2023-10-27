import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Regular } from '@definitions';
import { AllRegularsQuery } from '../providers';

export const allRegularsQuery$ =
  (httpClient: HttpClient): AllRegularsQuery =>
  (): Observable<(Entity & Regular)[]> =>
    httpClient.get<(Entity & Regular)[]>(`/api/regular/all`);
