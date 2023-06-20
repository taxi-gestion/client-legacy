import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FareToSchedule, FareToScheduleTransfer, SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../../providers';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import { formatScheduleFareError, toFareToScheduleTransfer } from './schedule-fare.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-fare',
  templateUrl: './schedule-fare.component.html'
})
export class ScheduleFareComponent {
  @Input({ required: true }) public scheduleFareFormInitialValues: Partial<FareToSchedule> = {};
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();
  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToScheduleTransfer(SCHEDULE_FARE_FORM.value as FareToScheduleTransfer));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  public constructor(@Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  public onScheduleFareActionSuccess = (): void => {
    SCHEDULE_FARE_FORM.reset();
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
  };
}
