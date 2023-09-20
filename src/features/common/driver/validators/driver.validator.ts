import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DriverValues } from '../definitions';

export const selectedDriverValidator =
  (driver: DriverValues | undefined): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    driverHasUuid(driver) ? null : { invalidDriver: { value: control.value } };

const driverHasUuid = (candidate: DriverValues | undefined): boolean => candidate !== undefined && candidate.id.length === 36;
