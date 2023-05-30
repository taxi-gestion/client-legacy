import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { FareByDayPresentation } from '../../presentation';

export const FARES_BY_DAY_READ: 'planning.fares-by-day.read' = 'planning.fares-by-day.read' as const;

export type FaresByDayRead = (date: Date) => Observable<FareByDayPresentation[]>;

export const faresByDayReadProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresByDayRead,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_BY_DAY_READ,
  useFactory,
  deps
});
