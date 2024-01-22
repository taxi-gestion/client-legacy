import { FormControl, FormGroup, Validators } from '@angular/forms';

import { WaypointValues } from '../../definitions';
import { AddWaypointFields, WaypointFields } from '../fields.form';
import { placeFieldFormControl } from '../../../place';

export const waypointFormControl = <T extends string>(formControlName: T): AddWaypointFields<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormGroup<WaypointFields>({
      ...placeFieldFormControl('place'),
      waypointName: new FormControl<WaypointValues['waypointName']>('', [Validators.required]),
      setKind: new FormControl<WaypointValues['setKind']>('none', []),
      setNature: new FormControl<WaypointValues['setNature']>('none', []),
      comment: new FormControl<WaypointValues['comment']>('', [])
    })
  } as AddWaypointFields<T>);
