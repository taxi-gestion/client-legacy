import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteFare } from '@definitions';

export type DeleteFareAction = (fareIdToDelete: string) => Observable<DeleteFare>;

export const DELETE_FARE_ACTION: { key: symbol } = { key: Symbol('fare.delete-fare.action') };

export const deleteFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DeleteFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DELETE_FARE_ACTION,
  useFactory,
  deps
});
