import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Driver, Entity } from '@domain';

export type SearchDriverQuery = (search: string) => Observable<(Driver & Entity)[]>;

export const LIST_DRIVERS_QUERY: symbol = Symbol('driver.list-drivers.queries');

export const listDriversQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => SearchDriverQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: LIST_DRIVERS_QUERY,
  useFactory,
  deps
});
