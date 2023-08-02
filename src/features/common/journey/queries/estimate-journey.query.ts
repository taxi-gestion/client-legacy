import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstimateJourneyQuery, JourneyEstimate, Journey } from '@features/common/journey';

const estimateJourneyUrl = (): string => `https://taxi-gestion.com/api/estimate-journey`;

export const estimateJourneyQuery$ =
  (http: HttpClient): EstimateJourneyQuery =>
  (journey: Journey): Observable<JourneyEstimate> =>
    http.post<JourneyEstimate>(estimateJourneyUrl(), {
      ...journey
    });
