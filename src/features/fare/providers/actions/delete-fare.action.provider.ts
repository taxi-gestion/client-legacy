import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { FaresDeleted } from '@definitions';

export type DeleteFareAction = (fareIdToDelete: string) => Observable<FaresDeleted>;

export const DELETE_FARE_ACTION: symbol = Symbol('fare.delete-fare.action');

export const deleteFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_FARE_ACTION,
  useFactory,
  deps
});
