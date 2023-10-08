import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, PendingScheduled, ReturnDrive } from '@definitions';

export type SchedulePendingAction = (returnToSchedule: Entity & ReturnDrive) => Observable<PendingScheduled>;

export const SCHEDULE_PENDING_ACTION: symbol = Symbol('fare.schedule-pending.action');

export const schedulePendingActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SchedulePendingAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_PENDING_ACTION,
  useFactory,
  deps
});
