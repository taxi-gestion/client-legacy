import { FormControl, Validators } from '@angular/forms';
import { PhoneValues } from '../../definitions/phone.definition';
import { phoneEmptyValue } from '../../phone.presenter';

export type PhoneField<T extends string> = {
  [K in T]: FormControl<PhoneValues>;
};

export const phoneFieldFormControl = <T extends string>(formControlName: T): PhoneField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<PhoneValues>(phoneEmptyValue, { nonNullable: true, validators: [Validators.required] })
  } as PhoneField<T>);
