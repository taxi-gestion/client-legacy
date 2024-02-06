import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type PredictRecurrenceQuery = (query: string) => Observable<object>;

export const PREDICT_RECURRENCE_QUERY: { key: symbol } = { key: Symbol('planning.predict-recurrence.action') };

export const predictRecurrenceQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => PredictRecurrenceQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: PREDICT_RECURRENCE_QUERY,
  useFactory,
  deps
});
