import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  faresForDateQuery$,
  pendingReturnsForDateQuery$,
  pendingReturnsForDateQueryProvider,
  registerRegularActionProvider,
  scheduledFaresForDateQueryProvider,
  scheduleFareActionProvider,
  scheduleReturnActionProvider,
  validatedRegisterRegularAction$,
  validatedScheduleFareAction$,
  validatedScheduleReturnAction$
} from '@features/planning';

import { predictRecurrenceQuery$, predictRecurrenceQueryProvider } from '@features/common/recurrence';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';
import { searchUserQueryProvider } from '@features/common/user';
import { cognitoListUsersWithDriverGroupQuery$ } from '@features/aws';
import { estimateJourneyQuery$, estimateJourneyQueryProvider } from '@features/common/journey';
import { searchPassengerQueryProvider, searchPassengersQuery$ } from '../../features/common/passenger';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  scheduleReturnActionProvider(validatedScheduleReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(pendingReturnsForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchUserQueryProvider(cognitoListUsersWithDriverGroupQuery$, [HttpClient]),
  searchPassengerQueryProvider(searchPassengersQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient])
];
