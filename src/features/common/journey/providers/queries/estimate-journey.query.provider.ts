import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Journey, JourneyEstimate } from '@definitions';

export type EstimateJourneyQuery = (journey: Journey) => Observable<JourneyEstimate>;

export const ESTIMATE_JOURNEY_QUERY: { key: symbol } = { key: Symbol('journey.estimate-journey.queries') };

export const estimateJourneyQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EstimateJourneyQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ESTIMATE_JOURNEY_QUERY,
  useFactory,
  deps
});
