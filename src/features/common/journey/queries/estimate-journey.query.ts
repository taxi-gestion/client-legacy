import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstimateJourneyQuery } from '@features/common/journey';
import { Journey, JourneyEstimate } from '@definitions';

const estimateJourneyUrl = (): string => `/api/journey/estimate`;

export const estimateJourneyQuery$ =
  (http: HttpClient): EstimateJourneyQuery =>
  (journey: Journey): Observable<JourneyEstimate> =>
    http.post<JourneyEstimate>(estimateJourneyUrl(), {
      ...journey
    });
