/* eslint-disable id-denylist */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common';
import { PHONE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { selectedPhoneValidator } from '../../validators';
import { filterOnPhoneValuesProperties } from './phone-field.presenter';
import { phoneEmptyValue } from '../../phone.presenter';
import { PhoneValues } from '../../definitions/phone.definition';

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

  // TODO Is this input necessary ?
  @Input() public set phone(phone: (PhoneValues | undefined) | null) {
    phone != null && this.onPhoneReceived(phone);
  }

  public onPhoneReceived(phoneNumberValue: PhoneValues): void {
    this.defaultValue = phoneNumberValue;
  }

  public defaultValue: PhoneValues = phoneEmptyValue;

  public phoneEmptyValue: PhoneValues = phoneEmptyValue;

  public toSearchTerm = (phoneValues: PhoneValues): string => phoneValues.phoneNumber;

  public toTrackBy: (index: number, phoneValues: PhoneValues) => string = (_: number, phoneValues: PhoneValues): string =>
    `${phoneValues.phoneType}${phoneValues.phoneNumber}`;

  public phoneValuesValidator: (phoneValues: PhoneValues | undefined) => ValidatorFn = selectedPhoneValidator;

  public query = (): Observable<PhoneValues[]> => of([]);

  public resultsFilter: (searchTerm: string) => (combinedResults: PhoneValues[]) => PhoneValues[] =
    filterOnPhoneValuesProperties;
}
