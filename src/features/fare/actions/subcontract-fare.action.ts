import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, SubcontractFare, ToSubcontracted } from '@definitions';
import { faresSubcontractedCodec, identityEncode } from '@codecs';
import { SubcontractFareAction } from '../providers';
import { apiPostWithValidation } from './functional-gateway';
import { Validation } from 'io-ts';

const subcontractFareUrl = (): string => `/api/fare/subcontract`;

export const subcontractFareAction$ =
  (httpClient: HttpClient): SubcontractFareAction =>
  (toSubcontract: Entity & ToSubcontracted): Observable<SubcontractFare> =>
    apiPostWithValidation<ToSubcontracted, ToSubcontracted, SubcontractFare>(
      httpClient,
      identityEncode,
      (input: unknown): Validation<SubcontractFare> => faresSubcontractedCodec.decode(input),
      subcontractFareUrl
    )(toSubcontract);
