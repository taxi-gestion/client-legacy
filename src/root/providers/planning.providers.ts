import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import { scheduleFareAction$, scheduleFareActionProvider, faresByDayQuery$, faresByDayQueryProvider } from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  faresByDayQueryProvider(faresByDayQuery$, [HttpClient])
];
