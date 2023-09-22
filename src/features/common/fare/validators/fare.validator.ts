import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Entity } from '@definitions';
import { ScheduledFareValues } from '../definitions';

export const selectedFareValidator =
  (fare: (Entity & ScheduledFareValues) | undefined): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    fareHasId(fare) ? null : { invalidFare: { value: control.value } };

export const fareHasId = (candidate: (Entity & ScheduledFareValues) | undefined): boolean =>
  candidate !== undefined && candidate.id.length === 36;
