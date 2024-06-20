import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '../../../../definitions';

export const DRIVER_AGENDA_FOR_DATE_QUERY: { key: symbol } = { key: Symbol('planning.driver-agenda-for-date.query') };

export type DriverAgendaForDateQuery = ({
  driver,
  date
}: {
  driver: Entity;
  date: string;
}) => Observable<(Entity & Scheduled)[]>;

export const driverAgendaForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => DriverAgendaForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: DRIVER_AGENDA_FOR_DATE_QUERY,
  useFactory,
  deps
});
