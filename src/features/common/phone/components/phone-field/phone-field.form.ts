import { FormControl, Validators } from '@angular/forms';
import { PhoneValues } from '../../definitions/phone.definition';
import { emptyPhoneValue } from '../../phone.presenter';
import { SelectPhoneField } from '../fields.form';

export const phoneFieldFormControl = <T extends string>(formControlName: T): SelectPhoneField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<PhoneValues>(emptyPhoneValue, { nonNullable: true, validators: [Validators.required] })
  } as SelectPhoneField<T>);
