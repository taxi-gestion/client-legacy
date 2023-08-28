import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Entity, Pending } from '@domain';
import { PendingReturnsForDateQuery } from '../../providers';
import { pipe as fpPipe } from 'fp-ts/function';
import { externalTypeCheckFor, pendingReturnsCodec } from '@codecs';
import { fold } from 'fp-ts/Either';
import { ValidationFailedAfterApiCallError } from '../../errors';

export const validatedPendingReturnsForDateQuery$ =
  (httpClient: HttpClient): PendingReturnsForDateQuery =>
  (date: string): Observable<(Entity & Pending)[]> =>
    fpPipe(
      httpClient.get<unknown>(`/api/pending-returns-for-date/${date}`),
      externalTypeCheckFor<(Entity & Pending)[]>(pendingReturnsCodec),
      fold(
        // TODO Share error reporter between projects
        (): Observable<never> => throwError((): Error => new ValidationFailedAfterApiCallError()),
        (validatedTransfer: (Entity & Pending)[]): Observable<(Entity & Pending)[]> => of(validatedTransfer)
      )
    );
