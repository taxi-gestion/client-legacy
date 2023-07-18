import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type FareToSchedule = {
  clientIdentity: string;
  clientPhone: string;
  date: string;
  driveFrom: string;
  driveKind: 'one-way' | 'outward' | 'return';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: string;
  startTime: string;
  recurrence: string | undefined;
  recurrenceQuery: string | undefined;
  recurrenceExplanation: string | undefined;
};

export type FareToScheduleTransfer = {
  clientIdentity: string;
  clientPhone: string;
  date: string;
  driveFrom: string;
  driveKind: 'one-way' | 'outward' | 'return';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: string;
  startTime: string;
  recurrence: string | undefined;
  recurrenceQuery: string | undefined;
  recurrenceExplanation: string | undefined;
};

export type ScheduleFareAction = (fareToSchedule: FareToScheduleTransfer) => Observable<object>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('planning.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
