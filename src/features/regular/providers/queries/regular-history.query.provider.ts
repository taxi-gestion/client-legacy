import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { RegularHistory } from '@definitions';

export type RegularHistoryQuery = (id: string) => Observable<RegularHistory>;

export const REGULAR_HISTORY_QUERY: symbol = Symbol('regular.regular-history.queries');

export const regularHistoryQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => RegularHistoryQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: REGULAR_HISTORY_QUERY,
  useFactory,
  deps
});
