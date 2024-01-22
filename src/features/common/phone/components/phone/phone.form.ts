import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddPhoneFields, PhoneFields } from '../fields.form';
import { PhoneValues } from '../../definitions';
import { phoneNumberValidator } from '../../validators';

export const phoneFormControl = <T extends string>(formControlName: T): AddPhoneFields<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormGroup<PhoneFields>({
      phoneType: new FormControl<PhoneValues['phoneType']>('', [Validators.required]),
      phoneNumber: new FormControl<PhoneValues['phoneNumber']>('', [Validators.required, phoneNumberValidator])
    })
  } as AddPhoneFields<T>);
