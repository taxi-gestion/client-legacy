import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstimateJourneyQuery } from '@features/common/journey';
import { Journey, JourneyEstimate } from '@domain';

const estimateJourneyUrl = (): string => `https://taxi-gestion.com/api/estimate-journey`;

export const estimateJourneyQuery$ =
  (http: HttpClient): EstimateJourneyQuery =>
  (journey: Journey): Observable<JourneyEstimate> =>
    http.post<JourneyEstimate>(estimateJourneyUrl(), {
      ...journey
    });
