import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import {
  scheduleFareAction$,
  scheduleFareActionProvider,
  faresForDateQuery$,
  faresForDateQueryProvider
} from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient])
];
