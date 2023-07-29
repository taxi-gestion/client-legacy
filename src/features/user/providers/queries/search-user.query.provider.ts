import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { User } from '../../definitions';

export type SearchUserQuery = (search: string) => Observable<User[]>;

export const SEARCH_USER_QUERY: symbol = Symbol('user.search-user.queries');

export const searchUserQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchUserQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_USER_QUERY,
  useFactory,
  deps
});
