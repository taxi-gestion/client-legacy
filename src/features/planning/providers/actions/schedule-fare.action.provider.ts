import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type FareToSchedule = {
  clientIdentity: string;
  clientPhone: string;
  date: Date;
  driveFrom: string;
  driveKind: 'go-back' | 'one-way' | 'outward';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: string;
  startTime: string;
};

export type FareToScheduleTransfer = {
  clientIdentity: string;
  clientPhone: string;
  date: string;
  driveFrom: string;
  driveKind: 'go-back' | 'one-way' | 'outward';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: string;
  startTime: string;
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
