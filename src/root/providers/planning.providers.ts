import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import {
  faresForDateQuery$,
  faresForDateQueryProvider,
  faresToScheduleForDateQuery$,
  faresToScheduleForDateQueryProvider,
  scheduleFareAction$,
  scheduleFareActionProvider
} from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  faresToScheduleForDateQueryProvider(faresToScheduleForDateQuery$, [HttpClient])
];
