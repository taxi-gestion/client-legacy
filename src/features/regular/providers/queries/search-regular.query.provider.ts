import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Entity, Regular } from '@definitions';

export type SearchRegularQuery = (search: string) => Observable<(Entity & Regular)[]>;

export const SEARCH_REGULAR_QUERY: { key: symbol } = { key: Symbol('regular.search-regular.queries') };

export const searchRegularQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchRegularQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_REGULAR_QUERY,
  useFactory,
  deps
});
