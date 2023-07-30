import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '@features/place';

export const FARES_FOR_DATE_QUERY: 'planning.fares-for-date.query' = 'planning.fares-for-date.query' as const;

export type FaresForDateQuery = (date: Date) => Observable<FaresForDate>;

export const faresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});

export type FareStatus = 'scheduled' /*| 'finished' | 'subcontracted'*/;

export type FaresForDate = FareForDate[];

export type FareForDate = {
  client: string;
  creator: string;
  date: string;
  departure: Place;
  destination: Place;
  distance: string;
  planning: string;
  duration: string;
  kind: 'one-way' | 'outward' | 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: FareStatus;
  time: string;
};
