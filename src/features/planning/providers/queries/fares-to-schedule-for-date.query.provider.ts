import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export const FARES_TO_SCHEDULE_FOR_DATE_QUERY: 'planning.fares-to-schedule-for-date.query' =
  'planning.fares-to-schedule-for-date.query' as const;

export type FaresToScheduleForDateQuery = (date: Date) => Observable<FaresToScheduleForDate>;

export const faresToScheduleForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresToScheduleForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_TO_SCHEDULE_FOR_DATE_QUERY,
  useFactory,
  deps
});

export type FaresToScheduleForDate = FareToScheduleForDate[];

export type FareToScheduleForDate = {
  client: string;
  creator: string;
  date: string;
  departure: string;
  destination: string;
  distance: string;
  planning: string | undefined;
  duration: string;
  kind: 'return';
  nature: 'medical' | 'standard';
  phone: string;
  status: 'to-schedule';
  time: string | undefined;
};
