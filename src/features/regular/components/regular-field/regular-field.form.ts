import { FormControl, Validators } from '@angular/forms';
import { RegularValues } from '../../definitions/regular.definition';
import { Entity } from '@definitions';
import { regularEmptyValue } from '../../common/regular.presenter';

export type RegularField<T extends string> = {
  [K in T]: FormControl<Entity & RegularValues>;
};

export const regularFieldFormControl = <T extends string>(
  formControlName: T,
  value?: (Entity & RegularValues) | undefined
): RegularField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<Entity & RegularValues>(value ?? regularEmptyValue, {
      nonNullable: true,
      validators: [Validators.required]
    })
  }) as RegularField<T>;
