import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { ToSchedule } from '@domain';

export type ScheduleFareAction = (fareToSchedule: ToSchedule) => Observable<object>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('planning.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
