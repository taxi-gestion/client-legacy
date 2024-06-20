import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '../../../../definitions';

export const DRIVER_FARES_FOR_DATE_QUERY: { key: symbol } = { key: Symbol('driver-pwa.driver-fares-for-date.query') };

export type DriverFaresForDateQuery = ({
  driver,
  date
}: {
  driver: Entity;
  date: string;
}) => Observable<(Entity & Scheduled)[]>;

export const driverFaresForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DriverFaresForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DRIVER_FARES_FOR_DATE_QUERY,
  useFactory,
  deps
});
