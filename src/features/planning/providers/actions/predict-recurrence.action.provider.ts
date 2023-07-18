import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';

export type PredictRecurrence = {
  query: string;
};

export type PredictedRecurrence = PredictRecurrence & {
  recurrence: string;
  explanation: string;
};

export type PredictRecurrenceAction = (query: string) => Observable<object>;

export const PREDICT_RECURRENCE_ACTION: symbol = Symbol('planning.predict-recurrence.action');

export const predictRecurrenceActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => PredictRecurrenceAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: PREDICT_RECURRENCE_ACTION,
  useFactory,
  deps
});
