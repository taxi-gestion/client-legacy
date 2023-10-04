import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, RegularDeleted } from '@definitions';

export type DeleteRegularAction = (regularToDelete: Entity) => Observable<RegularDeleted>;

export const DELETE_REGULAR_ACTION: symbol = Symbol('regular.delete-regular.action');

export const deleteRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_REGULAR_ACTION,
  useFactory,
  deps
});
