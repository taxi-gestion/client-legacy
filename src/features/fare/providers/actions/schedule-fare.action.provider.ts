import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { FaresScheduled, ToSchedule } from '@definitions';

export type ScheduleFareAction = (fareToSchedule: ToSchedule) => Observable<FaresScheduled>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('fare.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
