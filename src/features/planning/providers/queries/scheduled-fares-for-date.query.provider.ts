import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '@domain';

export const SCHEDULED_FARES_FOR_DATE_QUERY: 'planning.scheduled-fares-for-date.query' =
  'planning.scheduled-fares-for-date.query' as const;

export type ScheduledFaresForDateQuery = (date: string) => Observable<(Entity & Scheduled)[]>;

export const scheduledFaresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduledFaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULED_FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});
