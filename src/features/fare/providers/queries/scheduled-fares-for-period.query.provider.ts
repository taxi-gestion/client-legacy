import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '@definitions';

export const SCHEDULED_FARES_FOR_PERIOD_QUERY: symbol = Symbol('fare.scheduled-fares-for-period.query');

export type ScheduledFaresForPeriodQuery = (period: Period) => Observable<(Entity & Scheduled)[]>;

export type Period = {
  from: string;
  to: string;
};

export const scheduledFaresForPeriodQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduledFaresForPeriodQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULED_FARES_FOR_PERIOD_QUERY,
  useFactory,
  deps
});
