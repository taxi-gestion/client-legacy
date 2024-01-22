import { FormArray, FormGroup } from '@angular/forms';
import { WaypointFields, AddWaypointsFields } from '../fields.form';

export const waypointsArrayFormControl = <T extends string>(formControlName: T): AddWaypointsFields<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormArray<FormGroup<WaypointFields>>([])
  } as AddWaypointsFields<T>);
