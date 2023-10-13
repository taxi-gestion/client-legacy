import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Regular } from '@definitions';
import { RegularByIdQuery } from '../providers';

export const regularByIdQuery$ =
  (httpClient: HttpClient): RegularByIdQuery =>
  (id: string): Observable<Entity & Regular> =>
    httpClient.get<Entity & Regular>(`/api/regular/id/${id}`);
