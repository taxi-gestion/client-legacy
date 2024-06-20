import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, SchedulePending, PendingToScheduled } from '@definitions';

export type SchedulePendingAction = (returnToSchedule: Entity & PendingToScheduled) => Observable<SchedulePending>;

export const SCHEDULE_PENDING_ACTION: { key: symbol } = { key: Symbol('fare.schedule-pending.action') };

export const schedulePendingActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SchedulePendingAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_PENDING_ACTION,
  useFactory,
  deps
});
