import { FormControl, Validators } from '@angular/forms';
import { PendingReturnValues } from '../../definitions/fare.definition';
import { pendingReturnEmptyValue } from '../../presentation/fare.presenter';

export type PendingReturnField<T extends string> = {
  [K in T]: FormControl<PendingReturnValues>;
};

export const pendingReturnFieldFormControl = <T extends string>(
  formControlName: T,
  value?: PendingReturnValues | undefined
): PendingReturnField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<PendingReturnValues>(value ?? pendingReturnEmptyValue, {
      nonNullable: true,
      validators: [Validators.required]
    })
  }) as PendingReturnField<T>;
