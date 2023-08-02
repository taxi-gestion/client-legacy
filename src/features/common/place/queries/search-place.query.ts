import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place, SearchPlaceQuery } from '@features/common/place';

const searchPlaceUrl = (search: string): string => `https://taxi-gestion.com/api/search-place/${encodeURI(search)}`;

export const searchPlaceQuery$ =
  (http: HttpClient): SearchPlaceQuery =>
  (search: string): Observable<Place[]> =>
    http.get<Place[]>(searchPlaceUrl(search));
