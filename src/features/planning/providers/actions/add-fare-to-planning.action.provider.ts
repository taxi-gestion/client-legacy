import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type FareToAddToPlanning = {
  clientIdentity: string;
  clientPhone: string;
  date: Date;
  driveFrom: string;
  driveKind: 'one-way' | 'outward' | 'return';
  driveNature: 'medical' | 'standard';
  driverIdentity: string | undefined;
  driveTo: string;
  startTime: string;
};

export type AddFareToPlanningAction = (fareToAddToPlanning: FareToAddToPlanning) => Observable<object>;

export const ADD_FARE_TO_PLANNING_ACTION: symbol = Symbol('planning.add-fare-to-planning.action');

export const addFareToPlanningActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AddFareToPlanningAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ADD_FARE_TO_PLANNING_ACTION,
  useFactory,
  deps
});
