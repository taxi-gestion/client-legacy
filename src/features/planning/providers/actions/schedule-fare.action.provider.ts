import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { FareToSchedule } from '@domain';

export type ScheduleFareAction = (fareToSchedule: FareToSchedule) => Observable<object>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('planning.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
