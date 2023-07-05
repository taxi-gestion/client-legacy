import { AbstractControl, ValidationErrors } from '@angular/forms';

export const lessThanValidator =
  (path: string) =>
  (control: AbstractControl): ValidationErrors | null =>
    +(control.parent?.get(path)?.value ?? '0') > +control.value ? null : { invalidHourError: true };
