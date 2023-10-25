import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { selectedFareValidator } from '../../validators';
import { filterOnPassengerAndDriverAndDatetime, pendingReturnEmptyValue } from '../../presentation/fare.presenter';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { PendingReturnValues } from '../../definitions';
import { toIdentity } from '@features/regular';
import { Entity, Passenger } from '@definitions';
import { FARE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { toTime } from '@features/common/presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pending-field',
  templateUrl: './pending-return-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: FARE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class PendingReturnFieldComponent {
  @Input({ required: true }) public fareFieldControl!: FormControl<PendingReturnValues>;

  @Input() public prefilled: PendingReturnValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set fare(fare: (PendingReturnValues | undefined) | null) {
    fare !== null && this.onFareReceived(fare ?? pendingReturnEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<PendingReturnValues> = new EventEmitter<PendingReturnValues>();

  public onSelectedValueChange(fare: PendingReturnValues): void {
    this.fareFieldControl.setValue(fare);
    this.selectedValue.emit(fare);
  }

  public onFareReceived(fareValue: PendingReturnValues | undefined): void {
    this.defaultValue = fareValue;
  }

  public defaultValue: PendingReturnValues | undefined = pendingReturnEmptyValue;

  public fareEmptyValue: PendingReturnValues = pendingReturnEmptyValue;

  public toSearchTerm = (pendingReturnValues: PendingReturnValues): string => toIdentity(pendingReturnValues.passenger);

  public toTrackBy: (index: number, PendingReturnValues: PendingReturnValues) => string = (
    _: number,
    pendingReturnValues: PendingReturnValues
  ): string => `${pendingReturnValues.id}`;

  public fareValuesValidator: (pendingReturnValues: PendingReturnValues | undefined) => ValidatorFn = selectedFareValidator;

  public query$ = (_searchTerm: string): Observable<PendingReturnValues[]> => of([]);

  // eslint-disable-next-line @typescript-eslint/typedef
  public resultFilter = filterOnPassengerAndDriverAndDatetime;

  public passengerIdentity(passenger: Entity & Passenger): string {
    return toIdentity(passenger);
  }

  public time(datetime: string): string {
    return toTime(datetime);
  }
}
