import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecurringApplied } from '@definitions';
import { recurringsAppliedCodec } from '@codecs';
import { apiGetWithValidation } from './functional-gateway';
import { Validation } from 'io-ts';

import { ApplyRecurringAction } from '../providers/actions/apply-recurring.action.provider';

const applyRecurringUrl = (date: string): string => `/api/recurring/apply/${date}`;
type YYYYMMDDDate = string;

export const applyRecurringAction$ =
  (httpClient: HttpClient): ApplyRecurringAction =>
  (date: string): Observable<RecurringApplied[]> =>
    apiGetWithValidation<YYYYMMDDDate, RecurringApplied[]>(
      httpClient,
      (input: unknown): Validation<RecurringApplied[]> => recurringsAppliedCodec.decode(input),
      applyRecurringUrl
    )(date);
