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
  returnsToAffectForDateQuery$
} from '@features/planning';

import { GOOGLE_MAPS_API_KEY, googleMapsApiKeyValueProvider, searchPlaceQuery$ } from '@features/google';
import { ENV } from '../../environments';
import { predictRecurrenceActionProvider, predictRecurrenceAction$ } from '@features/recurrence';
import { searchPlaceQueryProvider } from '@features/place';
import { searchUserQueryProvider } from '@features/user';
import { cognitoListUsersWithDriverGroupQuery$ } from '@features/aws';
import { searchClientQueryProvider, searchClientsQuery$ } from '@features/client';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  googleMapsApiKeyValueProvider({ apiKey: ENV.api.maps }),
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceActionProvider(predictRecurrenceAction$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient, GOOGLE_MAPS_API_KEY]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchClientQueryProvider(searchClientsQuery$, [HttpClient])
];
