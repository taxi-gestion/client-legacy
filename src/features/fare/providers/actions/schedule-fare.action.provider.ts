import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleScheduled, ToScheduled } from '@definitions';

export type ScheduleFareAction = (fareToSchedule: ToScheduled) => Observable<ScheduleScheduled>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('fare.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
