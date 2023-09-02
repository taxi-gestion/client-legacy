import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Regular } from '@definitions';

export type SearchRegularQuery = (search: string) => Observable<Regular[]>;

export const SEARCH_REGULAR_QUERY: symbol = Symbol('regular.search-regular.queries');

export const searchRegularQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchRegularQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_REGULAR_QUERY,
  useFactory,
  deps
});
