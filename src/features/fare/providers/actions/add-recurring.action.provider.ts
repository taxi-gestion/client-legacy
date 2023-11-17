import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRecurring, ToRecurring } from '@definitions';

export type AddRecurringAction = (recurringToAdd: ToRecurring) => Observable<AddRecurring>;

export const ADD_RECURRING_ACTION: symbol = Symbol('recurrence.add-recurring.action');

export const addRecurringActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AddRecurringAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ADD_RECURRING_ACTION,
  useFactory,
  deps
});
