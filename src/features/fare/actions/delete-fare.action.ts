import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeleteFareAction } from '../providers';
import { DeleteFare } from '@definitions';
import { faresDeletedCodec } from '@codecs';
import { apiDeleteWithValidation } from './functional-gateway';
import { Validation } from 'io-ts';

type FareIdToDelete = string;
const deleteFareUrl = (fareId: FareIdToDelete): string => `/api/fare/delete/${fareId}`;

export const deleteFareAction$ =
  (httpClient: HttpClient): DeleteFareAction =>
  (fareIdToDelete: FareIdToDelete): Observable<DeleteFare> =>
    apiDeleteWithValidation<FareIdToDelete, DeleteFare>(
      httpClient,
      (input: unknown): Validation<DeleteFare> => faresDeletedCodec.decode(input),
      deleteFareUrl
    )(fareIdToDelete);
