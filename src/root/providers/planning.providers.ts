import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteFareActionProvider,
  deleteRegularActionProvider,
  driverAgendaForDateQueryProvider,
  editFareActionProvider,
  editRegularActionProvider,
  pendingReturnsForDateQueryProvider,
  registerRegularActionProvider,
  scheduledFaresForDateQueryProvider,
  scheduleFareActionProvider,
  schedulePendingActionProvider,
  subcontractFareActionProvider,
  validatedDeleteFareAction$,
  validatedDeleteRegularAction$,
  validatedDriverAgendaForDateQuery$,
  validatedEditFareAction$,
  validatedEditRegularAction$,
  validatedPendingReturnsForDateQuery$,
  validatedRegisterRegularAction$,
  validatedScheduledFaresForDateQuery$,
  validatedScheduleFareAction$,
  validatedSchedulePendingAction$,
  validatedSubcontractFareAction$
} from '@features/planning';

import { listDriversQuery$ } from '../../features/common/driver/queries/list-drivers';
import { estimateJourneyQuery$, estimateJourneyQueryProvider } from '@features/common/journey';
import {
  listDriversQueryProvider,
  listDriversWithOrderQuery$,
  listDriversWithOrderQueryProvider
} from '@features/common/driver';
import {
  regularByIdQuery$,
  regularByIdQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$
} from '@features/common/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';
import { predictRecurrenceQuery$, predictRecurrenceQueryProvider } from '@features/common/recurrence';

export const PLANNING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  deleteFareActionProvider(validatedDeleteFareAction$, [HttpClient]),
  deleteRegularActionProvider(validatedDeleteRegularAction$, [HttpClient]),
  driverAgendaForDateQueryProvider(validatedDriverAgendaForDateQuery$, [HttpClient]),
  editFareActionProvider(validatedEditFareAction$, [HttpClient]),
  editRegularActionProvider(validatedEditRegularAction$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  listDriversWithOrderQueryProvider(listDriversWithOrderQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(validatedPendingReturnsForDateQuery$, [HttpClient]),
  predictRecurrenceQueryProvider(predictRecurrenceQuery$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  regularByIdQueryProvider(regularByIdQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  schedulePendingActionProvider(validatedSchedulePendingAction$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  subcontractFareActionProvider(validatedSubcontractFareAction$, [HttpClient])
];
