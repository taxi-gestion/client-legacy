import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PhoneValues } from '../../definitions/phone.definition';

export type PhonesFields = FormArray<FormGroup<PhoneFields>>;

export type PhoneFields = {
  phoneType: FormControl<PhoneValues['phoneType'] | null>;
  phoneNumber: FormControl<PhoneValues['phoneNumber'] | null>;
};

export const phonesFormControls = (): Record<keyof { phones: PhonesFields }, PhonesFields> => ({
  phones: new FormArray<FormGroup<PhoneFields>>([])
});
