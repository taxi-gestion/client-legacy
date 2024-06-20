import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteRegular, Entity } from '@definitions';

export type DeleteRegularAction = (regularToDelete: Entity) => Observable<DeleteRegular>;

export const DELETE_REGULAR_ACTION: { key: symbol } = { key: Symbol('regular.delete-regular.action') };

export const deleteRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_REGULAR_ACTION,
  useFactory,
  deps
});
