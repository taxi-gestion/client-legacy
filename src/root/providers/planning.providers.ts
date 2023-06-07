import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import {
  addFareToPlanningAction$,
  addFareToPlanningActionProvider,
  faresByDayQuery$,
  faresByDayQueryProvider
} from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  addFareToPlanningActionProvider(addFareToPlanningAction$, [HttpClient]),
  faresByDayQueryProvider(faresByDayQuery$, [HttpClient])
];
