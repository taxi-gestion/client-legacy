import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FareToScheduleTransfer, SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../../providers';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import { formatScheduleFareError, toFareToScheduleTransfer } from './schedule-fare.presenter';
import { PlacePresentation } from '@features/place';
import { PredictedRecurrence } from '@features/recurrence';
import { UserPresentation } from '@features/user';
import { ClientPresentation } from '../../../../client';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-fare',
  templateUrl: './schedule-fare.component.html'
})
export class ScheduleFareComponent {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToScheduleTransfer(SCHEDULE_FARE_FORM.value as FareToScheduleTransfer));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  public onSelectDepartureChange(place: PlacePresentation): void {
    this.scheduleFareForm.controls.driveFrom.setValue(place);
  }

  public onSelectDestinationChange(place: PlacePresentation): void {
    this.scheduleFareForm.controls.driveTo.setValue(place);
  }

  public onSelectDriverChange(driver: UserPresentation): void {
    this.scheduleFareForm.controls.planning.setValue(driver.identifier);
  }

  public onSelectClientChange(client: ClientPresentation): void {
    this.scheduleFareForm.controls.clientIdentity.setValue(`${client.lastname} ${client.firstname}`);
    this.scheduleFareForm.controls.clientPhone.setValue(`${client.phone}`);
  }

  public onSearchClientTermChange(search: string): void {
    this.scheduleFareForm.controls.clientIdentity.setValue(search);
  }

  public constructor(@Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  public onPredictRecurrenceSuccessChange = (predictedRecurrence: PredictedRecurrence): void => {
    this.scheduleFareForm.controls.recurrence.setValue(predictedRecurrence);
  };

  public onScheduleFareActionSuccess = (): void => {
    SCHEDULE_FARE_FORM.reset();
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
  };
}
