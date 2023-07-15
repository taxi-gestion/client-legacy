import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PREDICT_RECURRENCE_ACTION, PredictedRecurrence, PredictRecurrenceAction } from '../../providers';
import { PREDICT_RECURRENCE_FORM, PredictRecurrenceFields, setPredictRecurrenceErrorToForm } from './predict-recurrence.form';
import { formatPredictRecurrenceError, getNextOccurrences } from './predict-recurrence.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-predict-recurrence',
  templateUrl: './predict-recurrence.component.html'
})
export class PredictRecurrenceComponent {
  @Input({ required: true }) public fromDate!: Date;

  @Output() public predictRecurrenceSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public predictRecurrenceSuccess: EventEmitter<PredictedRecurrence> = new EventEmitter<PredictedRecurrence>();

  @Output() public predictRecurrenceError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly predictRecurrence$ = (): Observable<object> =>
    this._predictRecurrenceAction$(PREDICT_RECURRENCE_FORM.controls.query.value as string);

  private readonly _displayNextOccurrences: Subject<Date[]> = new Subject<Date[]>();
  public readonly displayNextOccurrences$: Observable<Date[]> = this._displayNextOccurrences.asObservable();

  public readonly predictRecurrenceForm: FormGroup<PredictRecurrenceFields> = PREDICT_RECURRENCE_FORM;

  public constructor(@Inject(PREDICT_RECURRENCE_ACTION) private readonly _predictRecurrenceAction$: PredictRecurrenceAction) {}

  public onSubmitPredictRecurrence = (triggerAction: () => void): void => {
    PREDICT_RECURRENCE_FORM.markAllAsTouched();
    PREDICT_RECURRENCE_FORM.valid && triggerAction();
  };

  public onPredictRecurrenceActionSuccess = (predictedRecurrence: PredictedRecurrence): void => {
    this._displayNextOccurrences.next(
      getNextOccurrences((predictedRecurrence as { recurrence: string }).recurrence, this.fromDate)
    );
  };

  public onPredictRecurrenceActionError = (error: Error): void => {
    setPredictRecurrenceErrorToForm(formatPredictRecurrenceError(error));
  };
}
