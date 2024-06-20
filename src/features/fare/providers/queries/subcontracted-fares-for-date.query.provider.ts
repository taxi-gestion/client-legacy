import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Subcontracted } from '@definitions';
export const SUBCONTRACTED_FARES_QUERY: { key: symbol } = { key: Symbol('fare.subcontacted-fares-for-date.query') };

export type SubcontractedFaresQuery = (date: string) => Observable<(Entity & Subcontracted)[]>;

export const subcontractedFaresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SubcontractedFaresQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SUBCONTRACTED_FARES_QUERY,
  useFactory,
  deps
});
