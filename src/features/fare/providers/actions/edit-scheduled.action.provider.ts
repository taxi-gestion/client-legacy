import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { EditScheduled, Entity, ToScheduledEdited } from '@definitions';

export type EditScheduledAction = (scheduledToEdit: Entity & ToScheduledEdited) => Observable<EditScheduled>;

export const EDIT_SCHEDULED_ACTION: { key: symbol } = { key: Symbol('fare.edit-scheduled.action') };

export const editScheduledActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EditScheduledAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: EDIT_SCHEDULED_ACTION,
  useFactory,
  deps
});
