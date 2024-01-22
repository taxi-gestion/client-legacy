import { FormArray, FormGroup } from '@angular/forms';
import { PhoneFields, AddPhonesFields } from '../fields.form';

export const phonesFormControls = <T extends string>(formControlName: T): AddPhonesFields<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormArray<FormGroup<PhoneFields>>([])
  } as AddPhonesFields<T>);
