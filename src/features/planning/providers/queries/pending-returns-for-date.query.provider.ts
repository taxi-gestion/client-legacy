import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Pending } from '@definitions';

export const PENDING_RETURNS_FOR_DATE_QUERY: 'planning.pending-returns-for-date.query' =
  'planning.pending-returns-for-date.query' as const;

export type PendingReturnsForDateQuery = (date: string) => Observable<(Entity & Pending)[]>;

export const pendingReturnsForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => PendingReturnsForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: PENDING_RETURNS_FOR_DATE_QUERY,
  useFactory,
  deps
});
