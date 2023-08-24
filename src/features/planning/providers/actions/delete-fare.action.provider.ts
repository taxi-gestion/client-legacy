import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type DeleteFareAction = (fareIdToDelete: string) => Observable<object>;

export const DELETE_FARE_ACTION: symbol = Symbol('planning.delete-fare.action');

export const deleteFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_FARE_ACTION,
  useFactory,
  deps
});
