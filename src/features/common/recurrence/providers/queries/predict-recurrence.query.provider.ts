import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type PredictRecurrence = {
  query: string;
};

export type PredictedRecurrence = PredictRecurrence & {
  recurrence: string;
  explanation: string;
};

export type PredictedRecurrenceTransfer = PredictedRecurrence;

export type PredictRecurrenceQuery = (query: string) => Observable<object>;

export const PREDICT_RECURRENCE_QUERY: symbol = Symbol('planning.predict-recurrence.action');

export const predictRecurrenceQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => PredictRecurrenceQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: PREDICT_RECURRENCE_QUERY,
  useFactory,
  deps
});
