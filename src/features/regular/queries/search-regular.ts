import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRegularQuery } from '../providers';
import { Entity, Regular } from '@definitions';
import { apiGetWithValidation } from '../../fare/actions/functional-gateway';
import { Validation } from 'io-ts';
import { regularsEntitiesCodec } from '../../../codecs';

type SearchTerm = string;
const searchRegularUrl = (search: SearchTerm): string => `/api/regular/search/${search}`;

export const searchRegularsQuery$ =
  (httpClient: HttpClient): SearchRegularQuery =>
  (search: string): Observable<(Entity & Regular)[]> =>
    apiGetWithValidation<SearchTerm, (Entity & Regular)[]>(
      httpClient,
      (input: unknown): Validation<(Entity & Regular)[]> => regularsEntitiesCodec.decode(input),
      searchRegularUrl
    )(search);
