import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchPlaceQuery } from '@features/place/providers/queries';
import { Place } from '@features/place/definitions/places';
import { GoogleMaps } from '@features/google';

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
      localisation: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      }
    })
  );
