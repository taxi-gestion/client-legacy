import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { DriverWithOrder } from '@definitions';

export type ListDriversWithOrderQuery = () => Observable<DriverWithOrder[]>;

//export const LIST_DRIVERS_WITH_ORDER_QUERY: symbol = Symbol('driver.list-drivers-with-order.queries');
export const LIST_DRIVERS_WITH_ORDER_QUERY: { key: symbol } = { key: Symbol('driver.list-drivers-with-order.queries') };

export const listDriversWithOrderQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => ListDriversWithOrderQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: LIST_DRIVERS_WITH_ORDER_QUERY,
  useFactory,
  deps
});
