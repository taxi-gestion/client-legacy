import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Place, PlaceTransfer } from '@features/common/place';

// TODO link to Fare type so as to be protected from drift
export type ReturnToAffect = {
  fareId: string;
  driveFrom: Place;
  planning: string;
  driveTo: Place;
  startTime: string;
};

export type ReturnToAffectTransfer = {
  fareId: string;
  driveFrom: PlaceTransfer;
  planning: string;
  driveTo: PlaceTransfer;
  startTime: string;
};

export type AffectReturnAction = (returnToAffect: ReturnToAffectTransfer) => Observable<object>;

export const AFFECT_RETURN_ACTION: symbol = Symbol('planning.affect-return.action');

export const affectReturnActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AffectReturnAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: AFFECT_RETURN_ACTION,
  useFactory,
  deps
});
