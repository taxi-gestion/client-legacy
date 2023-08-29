import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Pending, Scheduled } from '@domain';

export type DeleteFareAction = (fareIdToDelete: string) => Observable<[Entity & Scheduled, (Entity & Pending)?]>;

export const DELETE_FARE_ACTION: symbol = Symbol('planning.delete-fare.action');

export const deleteFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_FARE_ACTION,
  useFactory,
  deps
});
