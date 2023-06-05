import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import { faresByDayQuery$, faresByDayQueryProvider } from '@features/planning';
import { addFareToPlanningActionProvider } from '@features/planning/providers/actions/add-fare-to-planning.action.provider';
import { addFareToPlanningAction$ } from '@features/planning/actions/create-fare/add-fare-to-planning.action';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  addFareToPlanningActionProvider(addFareToPlanningAction$, [HttpClient]),
  faresByDayQueryProvider(faresByDayQuery$, [HttpClient])
];
