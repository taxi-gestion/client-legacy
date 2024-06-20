import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, ScheduleUnassigned, ToScheduled } from '@definitions';

export type ScheduleUnassignedAction = (unassignedToSchedule: Entity & ToScheduled) => Observable<ScheduleUnassigned>;

export const SCHEDULE_UNASSIGNED_ACTION: { key: symbol } = { key: Symbol('fare.schedule-unassigned.action') };

export const scheduleUnassignedActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleUnassignedAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_UNASSIGNED_ACTION,
  useFactory,
  deps
});
