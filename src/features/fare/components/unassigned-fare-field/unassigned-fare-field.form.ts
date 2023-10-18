import { FormControl, Validators } from '@angular/forms';
import { UnassignedFareValues } from '../../definitions/fare.definition';
import { unassignedFareEmptyValue } from '../../presentation/fare.presenter';

export type UnassignedFareField<T extends string> = {
  [K in T]: FormControl<UnassignedFareValues>;
};

export const unassignedFareFieldFormControl = <T extends string>(
  formControlName: T,
  value?: UnassignedFareValues | undefined
): UnassignedFareField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<UnassignedFareValues>(value === undefined ? unassignedFareEmptyValue : value, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as UnassignedFareField<T>);
