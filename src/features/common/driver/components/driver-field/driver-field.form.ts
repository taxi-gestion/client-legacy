import { FormControl, Validators } from '@angular/forms';
import { DriverValues } from '../../definitions/driver.definition';
import { driverEmptyValue } from '../../driver.presenter';

export type DriverField<T extends string> = {
  [K in T]: FormControl<DriverValues>;
};

export const driverFieldFormControl = <T extends string>(
  formControlName: T,
  value?: DriverValues | undefined
): DriverField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<DriverValues>(value === undefined ? driverEmptyValue : value, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as DriverField<T>);
