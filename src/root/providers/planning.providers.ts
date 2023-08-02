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

import { estimateJourneyQuery$, GOOGLE_MAPS_API_KEY, googleMapsApiKeyValueProvider, searchPlaceQuery$ } from '@features/google';
import { ENV } from '../../environments';
import { predictRecurrenceQueryProvider, predictRecurrenceQuery$ } from '@features/common/recurrence';
import { searchPlaceQueryProvider } from '@features/common/place';
import { searchUserQueryProvider } from '@features/common/user';
import { cognitoListUsersWithDriverGroupQuery$ } from '@features/aws';
import { searchClientQueryProvider, searchClientsQuery$ } from '@features/common/client';
import { estimateJourneyQueryProvider } from '@features/common/journey';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  googleMapsApiKeyValueProvider({ apiKey: ENV.api.maps }),
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient, GOOGLE_MAPS_API_KEY]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchClientQueryProvider(searchClientsQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient, GOOGLE_MAPS_API_KEY])
];
