import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Subcontracted } from '../../../definitions';
import { apiGetWithValidation } from '../actions/functional-gateway';
import { Validation } from 'io-ts';
import { subcontractedFaresCodec } from '../../../codecs';
import { SubcontractedFaresQuery } from '../providers/queries/subcontracted-fares-for-date.query.provider';

const subcontractedUrl = (date: string): string => `/api/subcontracted/${date}`;

export const subcontractedFareForDateQuery$ =
  (httpClient: HttpClient): SubcontractedFaresQuery =>
  (date: string): Observable<(Entity & Subcontracted)[]> =>
    apiGetWithValidation<string, (Entity & Subcontracted)[]>(
      httpClient,
      (input: unknown): Validation<(Entity & Subcontracted)[]> => subcontractedFaresCodec.decode(input),
      subcontractedUrl
    )(date);
