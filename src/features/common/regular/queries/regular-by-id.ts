import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, RegularDetails } from '@definitions';
import { RegularByIdQuery } from '../providers';

export const regularByIdQuery$ =
  (httpClient: HttpClient): RegularByIdQuery =>
  (id: string): Observable<Entity & RegularDetails> =>
    httpClient.get<Entity & RegularDetails>(`/api/regular/id/${id}`);
