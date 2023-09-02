import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, PendingScheduled, ReturnDrive } from '@definitions';

export type SchedulePendingAction = (returnToSchedule: Entity & ReturnDrive) => Observable<PendingScheduled>;

export const SCHEDULE_RETURN_ACTION: symbol = Symbol('planning.schedule-return.action');

export const schedulePendingActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SchedulePendingAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_RETURN_ACTION,
  useFactory,
  deps
});
