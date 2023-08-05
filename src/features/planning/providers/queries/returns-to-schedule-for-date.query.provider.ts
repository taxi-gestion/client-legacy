import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { PendingReturnToSchedule } from '@domain';

export const RETURNS_TO_SCHEDULE_FOR_DATE_QUERY: 'planning.returns-to-schedule-for-date.query' =
  'planning.returns-to-schedule-for-date.query' as const;

export type ReturnsToScheduleForDateQuery = (date: string) => Observable<PendingReturnToSchedule[]>;

export const returnsToScheduleForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ReturnsToScheduleForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: RETURNS_TO_SCHEDULE_FOR_DATE_QUERY,
  useFactory,
  deps
});
