import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Passenger } from '@domain';

export type SearchPassengerQuery = (search: string) => Observable<Passenger[]>;

export const SEARCH_PASSENGER_QUERY: symbol = Symbol('passenger.search-passenger.queries');

export const searchPassengerQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchPassengerQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: SEARCH_PASSENGER_QUERY,
  useFactory,
  deps
});
