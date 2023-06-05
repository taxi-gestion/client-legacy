import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export const FARES_BY_DAY_QUERY: 'planning.fares-by-day.query' = 'planning.fares-by-day.query' as const;

export type FaresByDayQuery = (date: Date) => Observable<FareByDay[]>;

export const faresByDayQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresByDayQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_BY_DAY_QUERY,
  useFactory,
  deps
});

export type FareStatus = 'finished' | 'subcontracted';

export type FareByDay = {
  id: string;
  date: string;
  distance: string;
  duration: string;
  status: FareStatus;
  startTime: string;
};
