import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from './phone-numbers.validator';

export type PhoneNumberValues = {
  phoneType: string;
  phoneNumber: string;
};

export type PhoneNumberFields = {
  phoneType: FormControl<PhoneNumberValues['phoneType'] | null>;
  phoneNumber: FormControl<PhoneNumberValues['phoneNumber'] | null>;
};

export type PhonesField = {
  phones: FormArray<FormGroup<PhoneNumberFields>>;
};

export const PHONE_NUMBERS_FORM_CONTROLS: Record<keyof PhonesField, FormArray<FormGroup<PhoneNumberFields>>> = {
  phones: new FormArray([
    new FormGroup<PhoneNumberFields>(
      {
        phoneType: new FormControl<PhoneNumberValues['phoneType']>('', [Validators.required]),
        phoneNumber: new FormControl<PhoneNumberValues['phoneNumber']>('', [Validators.required])
      },
      []
    )
  ])
};

@Component({
  selector: 'app-phone-numbers',
  templateUrl: './phone-numbers.component.html'
})
export class PhoneNumbersComponent implements OnInit {
  @Input({ required: true }) public parentArray!: FormArray<FormGroup<PhoneNumberFields>>;

  @Input({ required: true }) public set phones(phones: PhoneNumberValues[] | null) {
    phones != null && this.onPhonesReceived(phones);
  }

  @Output() public formControlUpdated: EventEmitter<FormArray<FormGroup<PhoneNumberFields>>> = new EventEmitter<
    FormArray<FormGroup<PhoneNumberFields>>
  >();

  public onPhonesReceived(phoneNumberValues: PhoneNumberValues[]): void {
    this.parentArray.clear();
    phoneNumberValues.forEach((phone: PhoneNumberValues): void => {
      this.addPhone(phone);
    });
    this.formControlUpdated.emit(new FormArray(this.parentArray.controls.filter(onlyValidControl)));
  }

  public onFormChange(): void {
    if (!this.parentArray.valid) return;
    this.formControlUpdated.emit(new FormArray(this.parentArray.controls.filter(onlyValidControl)));
  }

  public constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    if (this.parentArray.length === 0) this.addPhone(undefined);
  }

  public createPhoneNumberGroup(phone: PhoneNumberValues | undefined): FormGroup<PhoneNumberFields> {
    return this.formBuilder.group({
      phoneType: [phone?.phoneType ?? '', [Validators.required]],
      phoneNumber: [phone?.phoneNumber ?? '', [Validators.required, phoneNumberValidator]]
    });
  }

  public addPhone(phone: PhoneNumberValues | undefined): void {
    this.parentArray.push(this.createPhoneNumberGroup(phone));
  }

  public removePhoneNumber(index: number): void {
    this.parentArray.removeAt(index);
  }
}

const onlyValidControl = (phoneNumberFormControl: FormGroup<PhoneNumberFields>): boolean => phoneNumberFormControl.valid;
