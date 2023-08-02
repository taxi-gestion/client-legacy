import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '@features/common/place';

export const RETURNS_TO_AFFECT_FOR_DATE_QUERY: 'planning.returns-to-affect-for-date.query' =
  'planning.returns-to-affect-for-date.query' as const;

export type ReturnsToAffectForDateQuery = (date: string) => Observable<ReturnsToAffectForDate>;

export const returnsToAffectForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ReturnsToAffectForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: RETURNS_TO_AFFECT_FOR_DATE_QUERY,
  useFactory,
  deps
});

export type ReturnsToAffectForDate = ReturnToAffectForDate[];

export type ReturnToAffectForDate = {
  id: string;
  client: string;
  date: string;
  departure: Place;
  destination: Place;
  planning: string | undefined;
  kind: 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'return-to-affect';
  time: string | undefined;
};
