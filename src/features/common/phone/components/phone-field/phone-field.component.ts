import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { PHONE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { selectedPhoneValidator } from '../../validators';
import { filterOnPhoneValuesProperties } from './phone-field.presenter';
import { emptyPhoneValue } from '../../phone.presenter';
import { PhoneValues } from '../../definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: PHONE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class PhoneFieldComponent {
  @Input({ required: true }) public phoneFieldControl!: FormControl<PhoneValues>;

  @Input() public prefilled: PhoneValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set phone(phone: (PhoneValues | undefined) | null) {
    phone !== null && this.onPhoneReceived(phone ?? emptyPhoneValue);
  }

  @Output() public readonly selectedValue: EventEmitter<PhoneValues> = new EventEmitter<PhoneValues>();

  public onSelectedValueChange(phone: PhoneValues): void {
    this.phoneFieldControl.setValue(phone);
    this.selectedValue.emit(phone);
  }

  public onPhoneReceived(phoneNumberValue: PhoneValues | undefined): void {
    this.defaultValue = phoneNumberValue;
  }

  public defaultValue: PhoneValues | undefined = emptyPhoneValue;

  public phoneEmptyValue: PhoneValues = emptyPhoneValue;

  public toSearchTerm = (phoneValues: PhoneValues): string => phoneValues.phoneNumber;

  public toTrackBy: (index: number, phoneValues: PhoneValues) => string = (_: number, phoneValues: PhoneValues): string =>
    `${phoneValues.phoneType}${phoneValues.phoneNumber}`;

  public phoneValuesValidator: (phoneValues: PhoneValues | undefined) => ValidatorFn = selectedPhoneValidator;

  public query$ = (): Observable<PhoneValues[]> => of([]);

  public resultsFilter: (searchTerm: string) => (combinedResults: PhoneValues[]) => PhoneValues[] =
    filterOnPhoneValuesProperties;
}
