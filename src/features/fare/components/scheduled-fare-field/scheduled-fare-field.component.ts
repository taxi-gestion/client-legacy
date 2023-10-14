import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { selectedFareValidator } from '../../validators';
import { filterOnPassengerAndDriver, scheduledFareEmptyValue } from '../../presentation/fare.presenter';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { ScheduledFareValues } from '../../definitions';
import { toIdentity } from '@features/common/regular';
import { Entity, Passenger } from '@definitions';
import { FARE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { toTime } from '@features/common/presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-scheduled-field',
  templateUrl: './scheduled-fare-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: FARE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class ScheduledFareFieldComponent {
  @Input({ required: true }) public fareFieldControl!: FormControl<ScheduledFareValues>;

  @Input() public prefilled: ScheduledFareValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set fare(fare: (ScheduledFareValues | undefined) | null) {
    fare !== null && this.onFareReceived(fare ?? scheduledFareEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<ScheduledFareValues> = new EventEmitter<ScheduledFareValues>();

  public onSelectedValueChange(fare: ScheduledFareValues): void {
    this.fareFieldControl.setValue(fare);
    this.selectedValue.emit(fare);
  }

  public onFareReceived(fareValue: ScheduledFareValues | undefined): void {
    this.defaultValue = fareValue;
  }

  public defaultValue: ScheduledFareValues | undefined = scheduledFareEmptyValue;

  public fareEmptyValue: ScheduledFareValues = scheduledFareEmptyValue;

  public toSearchTerm = (scheduledFareValues: ScheduledFareValues): string => toIdentity(scheduledFareValues.passenger);

  public toTrackBy: (index: number, ScheduledFareValues: ScheduledFareValues) => string = (
    _: number,
    scheduledFareValues: ScheduledFareValues
  ): string => `${scheduledFareValues.id}`;

  public fareValuesValidator: (ScheduledFareValues: ScheduledFareValues | undefined) => ValidatorFn = selectedFareValidator;

  public query$ = (_searchTerm: string): Observable<ScheduledFareValues[]> => of([]);

  // eslint-disable-next-line @typescript-eslint/typedef
  public resultFilter = filterOnPassengerAndDriver;

  public passengerIdentity(passenger: Entity & Passenger): string {
    return toIdentity(passenger);
  }

  public time(datetime: string): string {
    return toTime(datetime);
  }
}
