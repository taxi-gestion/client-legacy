import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { RecurringApplied } from '@definitions';

export type ApplyRecurringAction = (date: string) => Observable<RecurringApplied[]>;

export const APPLY_RECURRING_ACTION: symbol = Symbol('recurrence.apply-recurring.action');

export const applyRecurringActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ApplyRecurringAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: APPLY_RECURRING_ACTION,
  useFactory,
  deps
});
