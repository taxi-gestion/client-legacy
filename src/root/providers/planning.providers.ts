import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  scheduleReturnActionProvider,
  faresForDateQuery$,
  scheduledFaresForDateQueryProvider,
  returnsToScheduleForDateQueryProvider,
  scheduleFareActionProvider,
  returnsToScheduleForDateQuery$,
  validatedScheduleFareAction$,
  validatedScheduleReturnAction$
} from '@features/planning';

import { predictRecurrenceQueryProvider, predictRecurrenceQuery$ } from '@features/common/recurrence';
import { searchPlaceQueryProvider, searchPlaceQuery$ } from '@features/common/place';
import { searchUserQueryProvider } from '@features/common/user';
import { cognitoListUsersWithDriverGroupQuery$ } from '@features/aws';
import { estimateJourneyQueryProvider, estimateJourneyQuery$ } from '@features/common/journey';
import { searchPassengerQueryProvider, searchPassengersQuery$ } from '../../features/common/passenger';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  scheduleReturnActionProvider(validatedScheduleReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToScheduleForDateQueryProvider(returnsToScheduleForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchPassengerQueryProvider(searchPassengersQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient])
];
