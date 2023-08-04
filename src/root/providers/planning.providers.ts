import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  affectReturnActionProvider,
  faresForDateQuery$,
  faresForDateQueryProvider,
  returnsToAffectForDateQueryProvider,
  affectReturnAction$,
  scheduleFareActionProvider,
  returnsToAffectForDateQuery$,
  validatedScheduleFareAction$
} from '@features/planning';

import { predictRecurrenceQueryProvider, predictRecurrenceQuery$ } from '@features/common/recurrence';
import { searchPlaceQueryProvider, searchPlaceQuery$ } from '@features/common/place';
import { searchUserQueryProvider } from '@features/common/user';
import { cognitoListUsersWithDriverGroupQuery$ } from '@features/aws';
import { searchClientQueryProvider, searchClientsQuery$ } from '@features/common/client';
import { estimateJourneyQueryProvider, estimateJourneyQuery$ } from '@features/common/journey';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchClientQueryProvider(searchClientsQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient])
];
