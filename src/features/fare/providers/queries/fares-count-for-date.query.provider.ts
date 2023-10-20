import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { FaresCount } from '../../../../definitions';

export const FARES_COUNT_FOR_DATE_QUERY: symbol = Symbol('fare.fares-count-for-date.query');

export type FaresCountForDateQuery = (date: string) => Observable<FaresCount>;

export const faresCountForDateQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => FaresCountForDateQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: FARES_COUNT_FOR_DATE_QUERY,
  useFactory,
  deps
});
