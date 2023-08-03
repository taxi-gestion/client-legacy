import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '@features/common/place';

export const FARES_FOR_DATE_QUERY: 'planning.fares-for-date.query' = 'planning.fares-for-date.query' as const;

export type FaresForDateQuery = (date: string) => Observable<FareForDate[]>;

export const faresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});

export type FareForDate = {
  client: string;
  creator: string;
  datetime: string;
  departure: Place;
  destination: Place;
  distance: string;
  planning: string;
  duration: string;
  kind: 'one-way' | 'outward' | 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'scheduled';
};
