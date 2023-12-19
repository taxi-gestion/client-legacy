import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Recurring } from '@definitions';
import { apiGetWithValidation } from '../actions/functional-gateway';
import { Validation } from 'io-ts';
import { RecurringFaresQuery } from '../providers/queries/recurring-fares.query.provider';
import { recurringFaresCodec } from '../../../codecs';

const recurringUrl = (): string => `/api/recurring`;

export const recurringFaresQuery$ =
  (httpClient: HttpClient): RecurringFaresQuery =>
  (): Observable<(Entity & Recurring)[]> =>
    apiGetWithValidation<undefined, (Entity & Recurring)[]>(
      httpClient,
      (input: unknown): Validation<(Entity & Recurring)[]> => recurringFaresCodec.decode(input),
      recurringUrl
    )(undefined);
