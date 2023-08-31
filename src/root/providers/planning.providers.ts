import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  validatedDeleteFareAction$,
  deleteFareActionProvider,
  validatedScheduledFaresForDateQuery$,
  pendingReturnsForDateQueryProvider,
  registerRegularActionProvider,
  scheduledFaresForDateQueryProvider,
  scheduleFareActionProvider,
  scheduleReturnActionProvider,
  validatedPendingReturnsForDateQuery$,
  validatedRegisterRegularAction$,
  validatedScheduleFareAction$,
  validatedScheduleReturnAction$,
  editFareActionProvider,
  subcontractFareActionProvider
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
import { validatedEditFareAction$ } from '../../features/planning/actions/edit-fare.action';
import { validatedSubcontractFareAction$ } from '../../features/planning/actions/subcontract-fare.action';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  scheduleReturnActionProvider(validatedScheduleReturnAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(validatedPendingReturnsForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  searchPassengerQueryProvider(searchPassengersQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient]),
  deleteFareActionProvider(validatedDeleteFareAction$, [HttpClient]),
  editFareActionProvider(validatedEditFareAction$, [HttpClient]),
  subcontractFareActionProvider(validatedSubcontractFareAction$, [HttpClient])
];
