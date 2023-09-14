import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from './phones.validator';
import { string as ioString, type as ioType, Type } from 'io-ts';
import { BootstrapValidationClasses, bootstrapValidationClasses } from '@features/common';

export type PhonesFields = FormArray<FormGroup<PhoneFields>>;

export type PhoneFields = {
  phoneType: FormControl<PhoneValues['phoneType'] | null>;
  phoneNumber: FormControl<PhoneValues['phoneNumber'] | null>;
};

export type PhoneValues = {
  phoneType: string;
  phoneNumber: string;
};

export const phoneValuesCodec: Type<PhoneValues> = ioType({
  phoneType: ioString,
  phoneNumber: ioString
});

export const phonesFormControls = (): Record<keyof { phones: PhonesFields }, PhonesFields> => ({
  phones: new FormArray<FormGroup<PhoneFields>>([])
});

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html'
})
export class PhonesComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public parentArray!: PhonesFields;

  @Input() public set phones(phones: (PhoneValues[] | undefined) | null) {
    phones != null && this.onPhonesReceived(phones);
  }

  public onPhonesReceived(phoneNumberValues: PhoneValues[]): void {
    this.parentArray.clear();
    phoneNumberValues.forEach((phone: PhoneValues): void => {
      this.addPhone(phone);
    });
  }

  public createPhoneNumberGroup(phone: PhoneValues | undefined): FormGroup<PhoneFields> {
    return new FormGroup<PhoneFields>({
      phoneType: new FormControl<PhoneValues['phoneType']>(phone?.phoneType ?? '', [Validators.required]),
      phoneNumber: new FormControl<PhoneValues['phoneNumber']>(phone?.phoneNumber ?? '', [
        Validators.required,
        phoneNumberValidator
      ])
    });
  }

  public addPhone(phone: PhoneValues | undefined): void {
    this.parentArray.push(this.createPhoneNumberGroup(phone));
  }

  public removePhoneNumber(index: number): void {
    this.parentArray.removeAt(index);
  }
}
