import { Driver, Entity } from '@definitions';
import { AbstractControl, ValidationErrors } from '@angular/forms';

const UUID_LENGTH: 36 = 36 as const;
export const notEmptyDriverValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
  notEmptyDriver(control.value) ? null : { invalidPlace: { value: control.value } };

const notEmptyDriver = (value: Partial<Driver & Entity>): boolean => value.id !== undefined && value.id.length === UUID_LENGTH;
