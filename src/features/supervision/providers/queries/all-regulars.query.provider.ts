import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Entity, Regular } from '@definitions';

export type AllRegularsQuery = () => Observable<(Entity & Regular)[]>;

export const ALL_REGULARS_QUERY: { key: symbol } = { key: Symbol('supervision.all-regulars.queries') };

export const allRegularsQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AllRegularsQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ALL_REGULARS_QUERY,
  useFactory,
  deps
});
