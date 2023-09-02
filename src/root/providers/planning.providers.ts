import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteFareActionProvider,
  editFareActionProvider,
  pendingReturnsForDateQueryProvider,
  registerRegularActionProvider,
  scheduledFaresForDateQueryProvider,
  scheduleFareActionProvider,
  schedulePendingActionProvider,
  subcontractFareActionProvider,
  validatedDeleteFareAction$,
  validatedPendingReturnsForDateQuery$,
  validatedRegisterRegularAction$,
  validatedScheduledFaresForDateQuery$,
  validatedScheduleFareAction$,
  validatedSchedulePendingAction$
} from '@features/planning';

import {
  estimateJourneyQuery$,
  estimateJourneyQueryProvider,
  listDriversQuery$,
  listDriversQueryProvider,
  predictRecurrenceQuery$,
  predictRecurrenceQueryProvider,
  searchPlaceQuery$,
  searchPlaceQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$
} from '@features/common';
import { validatedEditFareAction$ } from '../../features/planning/actions/edit-fare.action';
import { validatedSubcontractFareAction$ } from '../../features/planning/actions/subcontract-fare.action';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  schedulePendingActionProvider(validatedSchedulePendingAction$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(validatedPendingReturnsForDateQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient]),
  deleteFareActionProvider(validatedDeleteFareAction$, [HttpClient]),
  editFareActionProvider(validatedEditFareAction$, [HttpClient]),
  subcontractFareActionProvider(validatedSubcontractFareAction$, [HttpClient])
];
