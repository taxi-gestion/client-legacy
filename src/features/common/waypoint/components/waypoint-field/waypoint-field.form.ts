import { FormControl, Validators } from '@angular/forms';
import { emptyWaypointValue } from '../../waypoint.presenter';

import { WaypointValues } from '../../definitions';
import { SelectWaypointField } from '../fields.form';

export const waypointFieldFormControl = <T extends string>(formControlName: T): SelectWaypointField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<WaypointValues>(emptyWaypointValue, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as SelectWaypointField<T>);
