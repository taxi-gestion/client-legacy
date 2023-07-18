import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import {
  affectReturnActionProvider,
  faresForDateQuery$,
  faresForDateQueryProvider,
  returnsToAffectForDateQueryProvider,
  scheduleFareAction$,
  affectReturnAction$,
  scheduleFareActionProvider,
  returnsToAffectForDateQuery$,
  predictRecurrenceActionProvider,
  predictRecurrenceAction$
} from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [
  scheduleFareActionProvider(scheduleFareAction$, [HttpClient]),
  affectReturnActionProvider(affectReturnAction$, [HttpClient]),
  predictRecurrenceActionProvider(predictRecurrenceAction$, [HttpClient]),
  faresForDateQueryProvider(faresForDateQuery$, [HttpClient]),
  returnsToAffectForDateQueryProvider(returnsToAffectForDateQuery$, [HttpClient])
];
