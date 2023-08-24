import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteFareAction$,
  deleteFareActionProvider,
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

import {
  estimateJourneyQuery$,
  estimateJourneyQueryProvider,
  listDriversQuery$,
  listDriversQueryProvider,
  predictRecurrenceQuery$,
  predictRecurrenceQueryProvider,
  searchPassengerQueryProvider,
  searchPassengersQuery$,
  searchPlaceQuery$,
  searchPlaceQueryProvider
} from '@features/common';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  scheduleReturnActionProvider(validatedScheduleReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(pendingReturnsForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  searchPassengerQueryProvider(searchPassengersQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient]),
  deleteFareActionProvider(deleteFareAction$, [HttpClient])
];
