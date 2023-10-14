import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteFareActionProvider,
  editFareActionProvider,
  scheduleFareActionProvider,
  validatedDeleteFareAction$,
  validatedEditFareAction$,
  validatedScheduleFareAction$,
  scheduledFaresForDateQueryProvider,
  validatedScheduledFaresForDateQuery$,
  pendingReturnsForDateQueryProvider,
  validatedPendingReturnsForDateQuery$,
  schedulePendingActionProvider,
  validatedSchedulePendingAction$
} from '@features/fare';
import { listDriversQuery$, listDriversQueryProvider } from '@features/common/driver';
import {
  regularByIdQuery$,
  regularByIdQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$
} from '@features/common/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';
import { estimateJourneyQuery$, estimateJourneyQueryProvider } from '@features/common/journey';

export const FARE_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  deleteFareActionProvider(validatedDeleteFareAction$, [HttpClient]),
  editFareActionProvider(validatedEditFareAction$, [HttpClient]),
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  pendingReturnsForDateQueryProvider(validatedPendingReturnsForDateQuery$, [HttpClient]),
  scheduleFareActionProvider(validatedScheduleFareAction$, [HttpClient]),
  schedulePendingActionProvider(validatedSchedulePendingAction$, [HttpClient]),
  listDriversQueryProvider(listDriversQuery$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  regularByIdQueryProvider(regularByIdQuery$, [HttpClient]),
  estimateJourneyQueryProvider(estimateJourneyQuery$, [HttpClient])
];
