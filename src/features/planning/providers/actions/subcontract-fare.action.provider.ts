import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, FareToSubcontract, Subcontracted } from '@domain';

export type SubcontractFareAction = (fareToSubcontract: Entity & FareToSubcontract) => Observable<Entity & Subcontracted>;

export const SUBCONTRACT_FARE_ACTION: symbol = Symbol('planning.subcontract-fare.action');

export const subcontractFareActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SubcontractFareAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SUBCONTRACT_FARE_ACTION,
  useFactory,
  deps
});
