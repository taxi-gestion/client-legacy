import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, FareToEdit, Pending, Scheduled } from '@domain';

export type EditFareAction = (fareToEdit: FareToEdit) => Observable<[Entity & Scheduled, (Entity & Pending)?]>;

export const EDIT_FARE_ACTION: symbol = Symbol('planning.edit-fare.action');

export const editFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EditFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: EDIT_FARE_ACTION,
  useFactory,
  deps
});
