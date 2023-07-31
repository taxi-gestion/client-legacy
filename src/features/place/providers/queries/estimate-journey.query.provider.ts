import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Journey, JourneyEstimate } from '../../definitions/journey';

export type EstimateJourneyQuery = (journey: Journey) => Observable<JourneyEstimate>;

export const ESTIMATE_JOURNEY_QUERY: symbol = Symbol('place.estimate-journey.queries');

export const estimateJourneyQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => EstimateJourneyQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ESTIMATE_JOURNEY_QUERY,
  useFactory,
  deps
});
