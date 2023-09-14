/* eslint-disable id-denylist */

import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
// eslint-disable-next-line max-statements
export const nullToUndefined = (obj: unknown): unknown => {
  if (obj === null) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item: unknown[]): unknown => nullToUndefined(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      result[key] = nullToUndefined(value);
    }

    return result;
  }

  return obj;
};

export type BootstrapValidationClasses = '' | 'is-invalid' | 'is-valid';

export const bootstrapValidationClasses = (control: AbstractControl): BootstrapValidationClasses =>
  // eslint-disable-next-line no-nested-ternary, @typescript-eslint/no-unnecessary-boolean-literal-compare
  control.touched === false ? '' : control.valid ? 'is-valid' : 'is-invalid';

// TODO Is there a better way than that ?
export const forceControlRevalidation = (control: AbstractControl): void => {
  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach((child: AbstractControl): void => {
      forceControlRevalidation(child);
    });
  } else if (control instanceof FormArray) {
    control.controls.forEach((child: AbstractControl): void => {
      forceControlRevalidation(child);
    });
  } else {
    control.markAsPending({ onlySelf: true });
    control.updateValueAndValidity({ onlySelf: true });
  }
};
