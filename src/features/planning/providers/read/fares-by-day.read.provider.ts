import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type FaresByDayRead<T> = () => Observable<T>;

export const FARES_BY_DAY_READ = 'planning.fares-by-day.read' as const;

export const faresByDayReadProvider = <TDependencies, TResult>(
  useFactory: (...providers: never[]) => FaresByDayRead<TResult>,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_BY_DAY_READ,
  useFactory,
  deps
});
