import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  affectReturnActionProvider,
  faresForDateQuery$,
  scheduledFaresForDateQueryProvider,
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
import { estimateJourneyQueryProvider, estimateJourneyQuery$ } from '@features/common/journey';
import { searchPassengerQueryProvider, searchPassengersQuery$ } from '../../features/common/passenger';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchPassengerQueryProvider(searchPassengersQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient])
];
