import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchPlaceQuery } from '../providers';
import { Place } from '@definitions';

const searchPlaceUrl = (search: string): string => `/api/place/search/${encodeURI(search)}`;

export const searchPlaceQuery$ =
  (http: HttpClient): SearchPlaceQuery =>
  (search: string): Observable<Place[]> =>
    http.get<Place[]>(searchPlaceUrl(search));
