import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import { scheduledFaresForDateQueryProvider, validatedScheduledFaresForDateQuery$ } from '@features/common/fare';

export const BILLING_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  scheduledFaresForDateQueryProvider(validatedScheduledFaresForDateQuery$, [HttpClient])
];
