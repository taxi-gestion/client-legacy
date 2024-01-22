import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatchRegularAction } from '../providers';
import { Entity, PatchRegular, RegularPatchableProperties } from '@definitions';
import { identityEncode, regularPatchedCodec } from '@codecs';
import { Validation } from 'io-ts';
import { apiPatchWithValidation } from '../../fare/actions/functional-gateway';

const patchRegularUrl = (): string => `/api/regular/patch`;

export const patchRegularAction$ =
  (httpClient: HttpClient): PatchRegularAction =>
  (regularToPatch: Entity & RegularPatchableProperties): Observable<PatchRegular> =>
    apiPatchWithValidation<Entity & RegularPatchableProperties, Entity & RegularPatchableProperties, PatchRegular>(
      httpClient,
      identityEncode,
      (input: unknown): Validation<PatchRegular> => regularPatchedCodec.decode(input),
      patchRegularUrl
    )(regularToPatch);
