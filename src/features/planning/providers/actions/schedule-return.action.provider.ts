import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, ReturnToSchedule } from '@domain';

export type ScheduleReturnAction = (returnToSchedule: Entity & ReturnToSchedule) => Observable<object>;

export const SCHEDULE_RETURN_ACTION: symbol = Symbol('planning.schedule-return.action');

export const scheduleReturnActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ScheduleReturnAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SCHEDULE_RETURN_ACTION,
  useFactory,
  deps
});
