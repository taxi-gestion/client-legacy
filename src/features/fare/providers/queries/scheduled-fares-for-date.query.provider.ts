import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '@definitions';

export const SCHEDULED_FARES_FOR_DATE_QUERY: { key: symbol } = { key: Symbol('fare.scheduled-fares-for-date.query') };

export type ScheduledFaresForDateQuery = (date: string) => Observable<(Entity & Scheduled)[]>;

export const scheduledFaresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduledFaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULED_FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});
