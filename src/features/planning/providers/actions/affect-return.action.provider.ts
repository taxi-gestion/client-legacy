import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { ReturnToAffectToScheduled } from '@domain';

export type AffectReturnAction = (returnToAffect: ReturnToAffectToScheduled) => Observable<object>;

export const AFFECT_RETURN_ACTION: symbol = Symbol('planning.affect-return.action');

export const affectReturnActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AffectReturnAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: AFFECT_RETURN_ACTION,
  useFactory,
  deps
});
