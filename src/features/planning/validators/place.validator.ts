import { isValidPlace } from '@definitions';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const placeValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,id-denylist
  isValidPlace(control.value) ? null : { invalidPlace: { value: control.value } };
