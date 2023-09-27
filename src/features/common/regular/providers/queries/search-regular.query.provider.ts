import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Entity, RegularDetails } from '@definitions';

export type SearchRegularQuery = (search: string) => Observable<(Entity & RegularDetails)[]>;

export const SEARCH_REGULAR_QUERY: symbol = Symbol('regular.search-regular.queries');

export const searchRegularQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchRegularQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_REGULAR_QUERY,
  useFactory,
  deps
});