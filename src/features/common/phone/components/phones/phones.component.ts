import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { BootstrapValidationClasses, bootstrapValidationClasses } from '@features/common';
import { PhoneValues } from '../../definitions/phone.definition';
import { PhoneFields, PhonesFields } from './phones.form';
import { phoneNumberValidator } from '../../validators';

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
