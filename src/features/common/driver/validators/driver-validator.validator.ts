import { Driver, Entity } from '@definitions';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const selectedDriverValidator =
  (driver: Driver & Entity, drivers: (Driver & Entity)[]): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,id-denylist
    driverIsInList(driver, drivers) ? null : { invalidDriver: { value: control.value } };

const driverIsInList = (candidate: Driver & Entity, drivers: (Driver & Entity)[]): boolean =>
  drivers.some((driver: Driver & Entity): boolean => driver.id === candidate.id);
