import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, RegularDetails, RegularEdited } from '@definitions';

export type EditRegularAction = (regularToEdit: Entity & RegularDetails) => Observable<RegularEdited>;

export const EDIT_REGULAR_ACTION: symbol = Symbol('regular.edit-regular.action');

export const editRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EditRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: EDIT_REGULAR_ACTION,
  useFactory,
  deps
});
