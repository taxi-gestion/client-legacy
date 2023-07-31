import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GoogleMaps } from '@features/google';
import { Place, SearchPlaceQuery } from '@features/place';

const searchPlaceUrl =
  (apiKey: string) =>
  (query: string): string =>
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURI(query)}&key=${apiKey}&language=fr`;

//const handleSearchPlaceError$ =
//  () =>
//    (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
//      switch (errorResponse.error.__type) {
//        default:
//          return throwError((): Observable<object> => caught);
//      }
//    };

type MapsResponse = {
  results: PlaceResultTransfer[];
  status: string;
};

export const searchPlaceQuery$ =
  (http: HttpClient, googleMaps: GoogleMaps): SearchPlaceQuery =>
  (search: string): Observable<Place[]> =>
    http.get<MapsResponse>(searchPlaceUrl(googleMaps.apiKey)(search)).pipe(
      map((response: MapsResponse): Place[] => toPlaces(response.results))
      //catchError(handleSearchPlaceError$())
    );

/* eslint-disable */
type PlaceResultTransfer = {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  adr_address: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon: string;
  id: string;
  name: string | undefined;
};
/* eslint-enable */

const toPlaces = (places: PlaceResultTransfer[]): Place[] =>
  places.map(
    (place: PlaceResultTransfer): Place => ({
      context: place.formatted_address,
      label: place.name ?? place.formatted_address,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      }
    })
  );
