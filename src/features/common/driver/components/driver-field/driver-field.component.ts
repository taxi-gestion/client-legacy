import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DRIVER_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DriverValues } from '../../definitions/driver.definition';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { selectedDriverValidator } from '../../validators/driver.validator';
import { driverEmptyValue } from '../../driver.presenter';
import { filterOnDriverValuesProperties } from './driver-field.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-driver-field',
  templateUrl: './driver-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: DRIVER_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class DriverFieldComponent {
  @Input({ required: true }) public driverFieldControl!: FormControl<DriverValues>;

  @Input() public prefilled: DriverValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set driver(driver: (DriverValues | undefined) | null) {
    driver !== null && this.onDriverReceived(driver ?? driverEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<DriverValues> = new EventEmitter<DriverValues>();

  public onSelectedValueChange(driver: DriverValues): void {
    this.driverFieldControl.setValue(driver);
    this.selectedValue.emit(driver);
  }

  public onDriverReceived(driverNumberValue: DriverValues | undefined): void {
    this.defaultValue = driverNumberValue;
  }

  public defaultValue: DriverValues | undefined = driverEmptyValue;

  public driverEmptyValue: DriverValues = driverEmptyValue;

  public toSearchTerm = (driverValues: DriverValues): string => driverValues.username;

  public toTrackBy: (index: number, driverValues: DriverValues) => string = (_: number, driverValues: DriverValues): string =>
    `${driverValues.id}`;

  public driverValuesValidator: (driverValues: DriverValues | undefined) => ValidatorFn = selectedDriverValidator;

  public resultFilter: (searchTerm: string) => (results: DriverValues[]) => DriverValues[] = filterOnDriverValuesProperties;

  public query$ = (_searchTerm: string): Observable<DriverValues[]> => of([]);
}
