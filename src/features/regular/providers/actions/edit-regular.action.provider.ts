import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { EditRegular, Entity, Regular } from '@definitions';

export type EditRegularAction = (regularToEdit: Entity & Regular) => Observable<EditRegular>;

export const EDIT_REGULAR_ACTION: { key: symbol } = { key: Symbol('regular.edit-regular.action') };

export const editRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EditRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: EDIT_REGULAR_ACTION,
  useFactory,
  deps
});
