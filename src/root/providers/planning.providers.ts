import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  affectReturnActionProvider,
  faresForDateQuery$,
  faresForDateQueryProvider,
  returnsToAffectForDateQueryProvider,
  scheduleFareAction$,
  affectReturnAction$,
  scheduleFareActionProvider,
  returnsToAffectForDateQuery$,
  predictRecurrenceActionProvider,
  predictRecurrenceAction$
} from '@features/planning';
import { searchPlaceQueryProvider } from '@features/places/providers/queries';
import { searchPlaceQuery$ } from '@features/google/maps/queries';
import { GOOGLE_MAPS_API_KEY, googleMapsApiKeyValueProvider } from '@features/google';
import { ENV } from '../../environments';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  googleMapsApiKeyValueProvider({ apiKey: ENV.api.maps }),
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceActionProvider(predictRecurrenceAction$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient, GOOGLE_MAPS_API_KEY])
];
