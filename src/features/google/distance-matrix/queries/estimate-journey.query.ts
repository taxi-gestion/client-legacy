import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GoogleMaps } from '@features/google';
import { EstimateJourneyQuery, JourneyEstimate, Journey } from '@features/common/journey';

const estimateJourneyUrl =
  (apiKey: string) =>
  (journey: Journey): string =>
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric` +
    `&origins=${journey.departure.location.latitude},${journey.departure.location.longitude}` +
    `&destinations=${journey.destination.location.latitude},${journey.destination.location.longitude}` +
    `&departure_time=now` +
    `&mode=driving&traffic_model=best_guess` +
    `&key=${apiKey}&language=fr`;

//&departure_time=${journey.departureTime.getTime()/1000}
//const handleEstimateJourneyError$ =
//  () =>
//    (errorResponse: HttpErrorResponse, caught: Observable<object>): Observable<object> => {
//      switch (errorResponse.error.__type) {
//        default:
//          return throwError((): Observable<object> => caught);
//      }
//    };

/* eslint-disable @typescript-eslint/naming-convention,id-denylist */
type DistanceMatrixResponse = {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: DistanceMatrixRows[];
  status: string;
};

type DistanceMatrixRows = {
  elements: DistanceMatrixElement[];
};

type DistanceMatrixElement = {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
};
/* eslint-enable @typescript-eslint/naming-convention,id-denylist */

export const estimateJourneyQuery$ =
  (http: HttpClient, googleMaps: GoogleMaps): EstimateJourneyQuery =>
  (journey: Journey): Observable<JourneyEstimate> =>
    http.get<DistanceMatrixResponse>(estimateJourneyUrl(googleMaps.apiKey)(journey)).pipe(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map((response: DistanceMatrixResponse): JourneyEstimate => toJourneyEstimate(response.rows[0]!.elements[0]!))
      //catchError(handleEstimateJourneyError$())
    );
const toJourneyEstimate = (element: DistanceMatrixElement): JourneyEstimate => ({
  distance: {
    text: element.distance.text,
    valueInMeters: element.distance.value
  },
  duration: {
    text: element.duration.text,
    valueInSeconds: element.duration.value
  }
});
