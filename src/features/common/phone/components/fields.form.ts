import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PhoneValues } from '../definitions';

export type PhoneFields = {
  phoneType: FormControl<PhoneValues['phoneType'] | null>;
  phoneNumber: FormControl<PhoneValues['phoneNumber'] | null>;
};

export type AddPhonesFields<T extends string> = {
  [K in T]: FormArray<FormGroup<PhoneFields>>;
};
export type AddPhoneFields<T extends string> = {
  [K in T]: FormGroup<PhoneFields>;
};

export type SelectPhoneField<T extends string> = {
  [K in T]: FormControl<PhoneValues>;
};
