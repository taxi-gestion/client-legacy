import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PlaceField } from '@features/common/place';

import { WaypointValues } from '../../definitions';

export type WaypointsArrayField<T extends string> = {
  [K in T]: FormArray<FormGroup<WaypointsArrayElementFields>>;
};

export type WaypointsArrayElementFields = PlaceField<'place'> & {
  waypointName: FormControl<WaypointValues['waypointName'] | null>;
  setKind: FormControl<WaypointValues['setKind'] | null>;
  setNature: FormControl<WaypointValues['setNature'] | null>;
  comment: FormControl<WaypointValues['comment'] | null>;
};

export const waypointsArrayFormControl = <T extends string>(formControlName: T): WaypointsArrayField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormArray<FormGroup<WaypointsArrayElementFields>>([])
  } as WaypointsArrayField<T>);
