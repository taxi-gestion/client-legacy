import { FormControl, Validators } from '@angular/forms';
import { emptyWaypointValue } from '../../waypoint.presenter';

import { WaypointValues } from '../../definitions';

export type WaypointField<T extends string> = {
  [K in T]: FormControl<WaypointValues>;
};

export const waypointFieldFormControl = <T extends string>(formControlName: T): WaypointField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<WaypointValues>(emptyWaypointValue, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as WaypointField<T>);
