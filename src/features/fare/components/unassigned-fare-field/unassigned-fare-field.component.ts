import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { selectedFareValidator } from '../../validators';
import { filterOnPassengerAndDatetime, unassignedFareEmptyValue } from '../../presentation/fare.presenter';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { UnassignedFareValues } from '../../definitions';
import { toIdentity } from '@features/common/regular';
import { Entity, Passenger } from '@definitions';
import { FARE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { toTime } from '@features/common/presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unassigned-field',
  templateUrl: './unassigned-fare-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: FARE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class UnassignedFareFieldComponent {
  @Input({ required: true }) public fareFieldControl!: FormControl<UnassignedFareValues>;

  @Input() public prefilled: UnassignedFareValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set fare(fare: (UnassignedFareValues | undefined) | null) {
    fare !== null && this.onFareReceived(fare ?? unassignedFareEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<UnassignedFareValues> = new EventEmitter<UnassignedFareValues>();

  public onSelectedValueChange(fare: UnassignedFareValues): void {
    this.fareFieldControl.setValue(fare);
    this.selectedValue.emit(fare);
  }

  public onFareReceived(fareValue: UnassignedFareValues | undefined): void {
    this.defaultValue = fareValue;
  }

  public defaultValue: UnassignedFareValues | undefined = unassignedFareEmptyValue;

  public fareEmptyValue: UnassignedFareValues = unassignedFareEmptyValue;

  public toSearchTerm = (unassignedFareValues: UnassignedFareValues): string => toIdentity(unassignedFareValues.passenger);

  public toTrackBy: (index: number, UnassignedFareValues: UnassignedFareValues) => string = (
    _: number,
    unassignedFareValues: UnassignedFareValues
  ): string => `${unassignedFareValues.id}`;

  public fareValuesValidator: (UnassignedFareValues: UnassignedFareValues | undefined) => ValidatorFn = selectedFareValidator;

  public query$ = (_searchTerm: string): Observable<UnassignedFareValues[]> => of([]);

  // eslint-disable-next-line @typescript-eslint/typedef
  public resultFilter = filterOnPassengerAndDatetime;

  public passengerIdentity(passenger: Entity & Passenger): string {
    return toIdentity(passenger);
  }

  public time(datetime: string): string {
    return toTime(datetime);
  }
}
