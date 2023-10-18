import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Unassigned } from '@definitions';

export const UNASSIGNED_FARES_FOR_DATE_QUERY: symbol = Symbol('fare.unassigned-fares-for-date.query');

export type UnassignedFaresForDateQuery = (date: string) => Observable<(Entity & Unassigned)[]>;

export const unassignedFaresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => UnassignedFaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: UNASSIGNED_FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});
