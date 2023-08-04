import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceTransfer } from '@features/common/place';

export type FareToSchedule = {
  passenger: string;
  phone: string;
  datetime: string;
  departure: PlaceTransfer;
  kind: 'one-way' | 'two-way';
  nature: 'medical' | 'standard';
  driver: string;
  arrival: PlaceTransfer;
  //recurrence: PredictedRecurrenceTransfer | undefined;
  duration: number;
  distance: number;
};

export type ScheduleFareAction = (fareToSchedule: FareToSchedule) => Observable<object>;

export const SCHEDULE_FARE_ACTION: symbol = Symbol('planning.schedule-fare.action');

export const scheduleFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_FARE_ACTION,
  useFactory,
  deps
});
