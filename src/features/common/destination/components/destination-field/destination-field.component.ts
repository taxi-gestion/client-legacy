import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { DESTINATION_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { filterOnDestinationValuesProperties } from './destination-field.presenter';
import { destinationEmptyValue } from '../../destination.presenter';
import { DestinationValues } from '../../definitions/destination.definition';
import { selectedDestinationValidator } from '../../validators';
import { Observable, of } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-destination-field',
  templateUrl: './destination-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: DESTINATION_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class DestinationFieldComponent {
  @Input({ required: true }) public destinationFieldControl!: FormControl<DestinationValues>;

  @Input() public prefilled: DestinationValues[] = [];

  @Input() public set destination(destination: (DestinationValues | undefined) | null) {
    destination !== null && this.onDestinationReceived(destination ?? destinationEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<DestinationValues> = new EventEmitter<DestinationValues>();

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  public onDestinationReceived(destinationNumberValue: DestinationValues | undefined): void {
    this.defaultValue = destinationNumberValue;
  }

  public defaultValue: DestinationValues | undefined = destinationEmptyValue;

  public destinationEmptyValue: DestinationValues = destinationEmptyValue;

  public toSearchTerm = (destinationValues: DestinationValues): string => destinationValues.destinationName;

  public toTrackBy: (index: number, destinationValues: DestinationValues) => string = (
    _: number,
    destinationValues: DestinationValues
  ): string =>
    `${destinationValues.destinationName}${destinationValues.place.location.latitude}${destinationValues.place.location.longitude}`;

  public destinationValuesValidator: (destinationValues: DestinationValues | undefined) => ValidatorFn =
    selectedDestinationValidator;

  public query$ = (_searchTerm: string): Observable<DestinationValues[]> => of([]);

  public resultsFilter: (searchTerm: string) => (combinedResults: DestinationValues[]) => DestinationValues[] =
    filterOnDestinationValuesProperties;

  public onSelectedValueChange(destination: DestinationValues): void {
    this.destinationFieldControl.setValue(destination);
    this.selectedValue.emit(destination);
  }
}
