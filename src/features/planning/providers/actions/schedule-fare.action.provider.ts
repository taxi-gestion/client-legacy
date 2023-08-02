import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Place, PlaceTransfer } from '@features/common/place';
import { PredictedRecurrence, PredictedRecurrenceTransfer } from '@features/common/recurrence';

export type FareToSchedule = {
  clientIdentity: string;
  clientPhone: string;
  datetime: string;
  driveFrom: Place;
  driveKind: 'one-way' | 'outward' | 'return';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: Place;
  recurrence: PredictedRecurrence | undefined;
  duration: number;
  distance: number;
};

export type FareToScheduleTransfer = {
  clientIdentity: string;
  clientPhone: string;
  datetime: string;
  driveFrom: PlaceTransfer;
  driveKind: 'one-way' | 'outward' | 'return';
  driveNature: 'medical' | 'standard';
  planning: string | undefined;
  driveTo: PlaceTransfer;
  recurrence: PredictedRecurrenceTransfer | undefined;
  duration: number;
  distance: number;
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
