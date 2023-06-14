import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction, FARES_BY_DAY_QUERY, FaresForDateQuery, FaresForDate } from '../../providers';
import { formatScheduleFareError, formatDate } from './schedule-fare.presenter';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFareExperimentalPage {
  public readonly scheduleFare$ = (): Observable<object> => this._scheduleFareAction$(SCHEDULE_FARE_FORM.getRawValue());

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  public readonly faresForDate$: Observable<FaresForDate> = this._faresForDateQuery$(new Date());

  public readonly today: string = formatDate(new Date());

  public constructor(
    @Inject(FARES_BY_DAY_QUERY) private readonly _faresForDateQuery$: FaresForDateQuery,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction
  ) {}

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
