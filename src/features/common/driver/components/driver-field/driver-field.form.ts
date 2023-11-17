import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { DriverValues } from '../../definitions/driver.definition';
import { driverEmptyValue } from '../../driver.presenter';
import { Entity } from '@definitions';

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
      validators: [Validators.required, notEmptyDriverValidator]
    })
  } as DriverField<T>);

const UUID_LENGTH: 36 = 36 as const;
const notEmptyDriverValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
  notEmptyDriver(control.value) ? null : { invalidDriver: { value: control.value } };

const notEmptyDriver = (value: Partial<DriverValues & Entity>): boolean =>
  value.id !== undefined && value.id.length === UUID_LENGTH;

export const optionalDriverFieldFormControl = <T extends string>(
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
