import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Destination } from '@definitions';

export const isDestination = (destination?: Destination): boolean => destination?.place != null && destination.name !== '';

export const destinationValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,id-denylist
  isDestination(control.value) ? null : { invalidDestination: { value: control.value } };
