import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { AllocateUnassigned, ToUnassigned } from '@definitions';

export type AllocateUnassignedAction = (unassignedToAllocate: ToUnassigned) => Observable<AllocateUnassigned>;

export const ALLOCATE_UNASSIGNED_ACTION: { key: symbol } = { key: Symbol('fare.allocate-unassigned.action') };

export const allocateUnassignedActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => AllocateUnassignedAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: ALLOCATE_UNASSIGNED_ACTION,
  useFactory,
  deps
});
