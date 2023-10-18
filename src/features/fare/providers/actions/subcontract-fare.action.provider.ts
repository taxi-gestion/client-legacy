import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, SubcontractFare, ToSubcontracted } from '@definitions';

export type SubcontractFareAction = (fareToSubcontract: Entity & ToSubcontracted) => Observable<SubcontractFare>;

export const SUBCONTRACT_FARE_ACTION: symbol = Symbol('fare.subcontract-fare.action');

export const subcontractFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SubcontractFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SUBCONTRACT_FARE_ACTION,
  useFactory,
  deps
});
