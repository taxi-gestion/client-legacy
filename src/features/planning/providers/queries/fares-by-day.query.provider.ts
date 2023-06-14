import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export const FARES_BY_DAY_QUERY: 'planning.fares-by-day.query' = 'planning.fares-by-day.query' as const;

export type FaresForDateQuery = (date: Date) => Observable<FaresForDate>;

export const faresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_BY_DAY_QUERY,
  useFactory,
  deps
});

export type FareStatus = 'finished' | 'subcontracted';

export type FaresForDate = FareForDate[];
export type FareForDate = {
  id: string;
  date: string;
  distance: string;
  duration: string;
  status: FareStatus;
  startTime: string;
};
