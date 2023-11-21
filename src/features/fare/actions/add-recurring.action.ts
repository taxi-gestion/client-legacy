import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddRecurringAction } from '../providers';
import { AddRecurring, ToRecurring } from '@definitions';
import { addRecurringCodec, identityEncode } from '@codecs';
import { apiPostWithValidation } from './functional-gateway';
import { Validation } from 'io-ts';

const addRecurringUrl = (): string => `/api/fare/recurring/add`;

export const addRecurringAction$ =
  (httpClient: HttpClient): AddRecurringAction =>
  (recurringToAdd: ToRecurring): Observable<AddRecurring> =>
    apiPostWithValidation<ToRecurring, ToRecurring, AddRecurring>(
      httpClient,
      identityEncode,
      (input: unknown): Validation<AddRecurring> => addRecurringCodec.decode(input),
      addRecurringUrl
    )(recurringToAdd);
