import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Driver, Entity } from '@definitions';

export type ListDriversQuery = () => Observable<(Driver & Entity)[]>;

export const LIST_DRIVERS_QUERY: { key: symbol } = { key: Symbol('driver.list-drivers.queries') };

export const listDriversQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ListDriversQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: LIST_DRIVERS_QUERY,
  useFactory,
  deps
});
