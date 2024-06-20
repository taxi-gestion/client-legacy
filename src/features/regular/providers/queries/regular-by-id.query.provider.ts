import { Observable } from 'rxjs';
import { FactoryProvider } from '@angular/core';
import { Entity, Regular } from '@definitions';

export type RegularByIdQuery = (id: string) => Observable<Entity & Regular>;

export const REGULAR_BY_ID_QUERY: { key: symbol } = { key: Symbol('regular.regular-by-id.queries') };

export const regularByIdQueryProvider = <TDependencies>(
  useFactory: (...providers: never[]) => RegularByIdQuery,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: REGULAR_BY_ID_QUERY,
  useFactory,
  deps
});
