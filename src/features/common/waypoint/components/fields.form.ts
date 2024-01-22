import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { WaypointValues } from '../definitions';
import { PlaceField } from '../../place';

export type WaypointFields = PlaceField<'place'> & {
  waypointName: FormControl<WaypointValues['waypointName'] | null>;
  setKind: FormControl<WaypointValues['setKind'] | null>;
  setNature: FormControl<WaypointValues['setNature'] | null>;
  comment: FormControl<WaypointValues['comment'] | null>;
};

export type AddWaypointsFields<T extends string> = {
  [K in T]: FormArray<FormGroup<WaypointFields>>;
};

export type AddWaypointFields<T extends string> = {
  [K in T]: FormGroup<WaypointFields>;
};

export type SelectWaypointField<T extends string> = {
  [K in T]: FormControl<WaypointValues>;
};
