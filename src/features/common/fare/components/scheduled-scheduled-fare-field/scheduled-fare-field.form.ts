import { FormControl, Validators } from '@angular/forms';
import { ScheduledFareValues } from '../../definitions/fare.definition';
import { scheduledFareEmptyValue } from '../../fare.presenter';

export type ScheduledFareField<T extends string> = {
  [K in T]: FormControl<ScheduledFareValues>;
};

export const scheduledFareFieldFormControl = <T extends string>(
  formControlName: T,
  value?: ScheduledFareValues | undefined
): ScheduledFareField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<ScheduledFareValues>(value === undefined ? scheduledFareEmptyValue : value, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as ScheduledFareField<T>);
