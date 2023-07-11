import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type ReturnToAffect = {
  fareId: string;
  driveFrom: string;
  planning: string;
  driveTo: string;
  startTime: string;
};

export type ReturnToAffectTransfer = {
  fareId: string;
  driveFrom: string;
  planning: string;
  driveTo: string;
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
