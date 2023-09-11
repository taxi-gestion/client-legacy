import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from './phones.validator';

export type PhonesFields = FormArray<FormGroup<PhoneFields>>;

export type PhoneFields = {
  phoneType: FormControl<PhoneValues['phoneType'] | null>;
  phoneNumber: FormControl<PhoneValues['phoneNumber'] | null>;
};

export type PhoneValues = {
  phoneType: string;
  phoneNumber: string;
};

const PHONE_FORM_GROUP: FormGroup<PhoneFields> = new FormGroup<PhoneFields>(
  {
    phoneType: new FormControl<PhoneValues['phoneType']>('', [Validators.required]),
    phoneNumber: new FormControl<PhoneValues['phoneNumber']>('', [Validators.required])
  },
  []
);

export const PHONES_FORM_CONTROLS: Record<keyof { phones: PhonesFields }, PhonesFields> = {
  phones: new FormArray([PHONE_FORM_GROUP])
};

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html'
})
export class PhonesComponent implements OnInit {
  @Input({ required: true }) public parentArray!: PhonesFields;

  @Input() public set phones(phones: PhoneValues[] | null) {
    phones != null && this.onPhonesReceived(phones);
  }

  @Output() public formControlUpdated: EventEmitter<PhonesFields> = new EventEmitter<PhonesFields>();

  public onPhonesReceived(phoneNumberValues: PhoneValues[]): void {
    this.parentArray.clear();
    phoneNumberValues.forEach((phone: PhoneValues): void => {
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

  public createPhoneNumberGroup(phone: PhoneValues | undefined): FormGroup<PhoneFields> {
    return this.formBuilder.group({
      phoneType: [phone?.phoneType ?? '', [Validators.required]],
      phoneNumber: [phone?.phoneNumber ?? '', [Validators.required, phoneNumberValidator]]
    });
  }

  public addPhone(phone: PhoneValues | undefined): void {
    this.parentArray.push(this.createPhoneNumberGroup(phone));
  }

  public removePhoneNumber(index: number): void {
    this.parentArray.removeAt(index);
  }
}

const onlyValidControl = (phoneNumberFormControl: FormGroup<PhoneFields>): boolean => phoneNumberFormControl.valid;
