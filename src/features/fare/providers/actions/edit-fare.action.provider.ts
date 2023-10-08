import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, FaresEdited, ToEdit } from '@definitions';

export type EditFareAction = (fareToEdit: Entity & ToEdit) => Observable<FaresEdited>;

export const EDIT_FARE_ACTION: symbol = Symbol('fare.edit-fare.action');

export const editFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EditFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: EDIT_FARE_ACTION,
  useFactory,
  deps
});
