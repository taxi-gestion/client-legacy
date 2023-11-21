import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteFareActionProvider,
  editScheduledActionProvider,
  scheduleFareActionProvider,
  validatedScheduleFareAction$,
  scheduledFaresForDateQueryProvider,
  validatedScheduledFaresForDateQuery$,
  pendingReturnsForDateQueryProvider,
  validatedPendingReturnsForDateQuery$,
  schedulePendingActionProvider,
  validatedSchedulePendingAction$,
  allocateUnassignedActionProvider,
  allocateUnassignedAction$,
  faresCountForDateQueryProvider,
  faresCountForDateQuery$,
  scheduleUnassignedActionProvider,
  scheduleUnassignedAction$,
  validatedEditScheduledAction$,
  unassignedFaresForDateQueryProvider,
  unassignedFaresForDateQuery$,
  addRecurringActionProvider,
  deleteFareAction$
} from '@features/fare';
import { listDriversQuery$, listDriversQueryProvider } from '@features/common/driver';
import {
  regularByIdQuery$,
  regularByIdQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$
} from '@features/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';
import { estimateJourneyQuery$, estimateJourneyQueryProvider } from '@features/common/journey';
import { addRecurringAction$ } from '../../features/fare';
import { recurringFaresQueryProvider } from '../../features/fare/providers/queries/recurring-fares.query.provider';
import { recurringFaresQuery$ } from '../../features/fare/queries/recurring-fares.query';
import { applyRecurringActionProvider } from '../../features/fare/providers/actions/apply-recurring.action.provider';
import { applyRecurringAction$ } from '../../features/fare/actions/apply-recurring.action';

export const FARE_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  allocateUnassignedActionProvider(allocateUnassignedAction$, [HttpClient]),
  deleteFareActionProvider(deleteFareAction$, [HttpClient]),
  editScheduledActionProvider(validatedEditScheduledAction$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient]),
  faresCountForDateQueryProvider(faresCountForDateQuery$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(validatedPendingReturnsForDateQuery$, [HttpClient]),
  regularByIdQueryProvider(regularByIdQuery$, [HttpClient]),
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  schedulePendingActionProvider(validatedSchedulePendingAction$, [HttpClient]),
  scheduleUnassignedActionProvider(scheduleUnassignedAction$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  unassignedFaresForDateQueryProvider(unassignedFaresForDateQuery$, [HttpClient]),
  addRecurringActionProvider(addRecurringAction$, [HttpClient]),
  recurringFaresQueryProvider(recurringFaresQuery$, [HttpClient]),
  applyRecurringActionProvider(applyRecurringAction$, [HttpClient])
];