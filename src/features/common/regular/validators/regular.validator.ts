import { RegularValues } from '../definitions';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Entity } from '@definitions';

export const selectedRegularValidator =
  (regular: (Entity & RegularValues) | undefined): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    regularHasId(regular) ? null : { invalidRegular: { value: control.value } };

export const regularHasId = (candidate: (Entity & RegularValues) | undefined): boolean =>
  candidate !== undefined && candidate.id.length === 36;

export const isValidRegular = (regular: Entity & RegularValues): boolean => regularHasId(regular);
