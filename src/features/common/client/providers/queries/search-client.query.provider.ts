import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Client } from '../../definitions';

export type SearchClientQuery = (search: string) => Observable<Client[]>;

export const SEARCH_CLIENT_QUERY: symbol = Symbol('client.search-client.queries');

export const searchClientQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchClientQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_CLIENT_QUERY,
  useFactory,
  deps
});
