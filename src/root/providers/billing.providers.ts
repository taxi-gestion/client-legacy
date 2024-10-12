import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  scheduledFaresForDateQueryProvider,
  scheduledFaresForPeriodQueryProvider,
  validatedScheduledFaresForDateQuery$,
  validatedScheduledFaresForPeriodQuery$
} from '@features/fare';

export const BILLING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient]),
  scheduledFaresForPeriodQueryProvider(validatedScheduledFaresForPeriodQuery$, [HttpClient])
];
