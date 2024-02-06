import { FactoryProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { PatchRegular, Entity, RegularPatchableProperties } from '@definitions';

export type PatchRegularAction = (regularToPatch: Entity & RegularPatchableProperties) => Observable<PatchRegular>;

export const PATCH_REGULAR_ACTION: { key: symbol } = { key: Symbol('regular.patch-regular.action') };

export const patchRegularActionProvider = <TDependencies>(
  useFactory: (...providers: never[]) => PatchRegularAction,
  deps: TDependencies[] = []
): FactoryProvider => ({
  provide: PATCH_REGULAR_ACTION,
  useFactory,
  deps
});
