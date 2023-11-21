import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Recurring } from '@definitions';

export const RECURRING_FARES_QUERY: symbol = Symbol('fare.recurring-fares.query');

export type RecurringFaresQuery = () => Observable<(Entity & Recurring)[]>;

export const recurringFaresQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => RecurringFaresQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: RECURRING_FARES_QUERY,
  useFactory,
  deps
});
