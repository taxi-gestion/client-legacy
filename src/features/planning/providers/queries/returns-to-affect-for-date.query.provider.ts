import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, ReturnToAffect } from '@domain';

export const RETURNS_TO_AFFECT_FOR_DATE_QUERY: 'planning.returns-to-affect-for-date.query' =
  'planning.returns-to-affect-for-date.query' as const;

export type ReturnsToAffectForDateQuery = (date: string) => Observable<Entity<ReturnToAffect>[]>;

export const returnsToAffectForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ReturnsToAffectForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: RETURNS_TO_AFFECT_FOR_DATE_QUERY,
  useFactory,
  deps
});
