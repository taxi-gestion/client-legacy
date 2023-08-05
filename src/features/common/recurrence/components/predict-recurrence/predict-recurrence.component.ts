import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PREDICT_RECURRENCE_QUERY, PredictRecurrenceQuery } from '../../providers';
import { PREDICT_RECURRENCE_FORM, PredictRecurrenceFields, setPredictRecurrenceErrorToForm } from './predict-recurrence.form';
import { formatPredictRecurrenceError, getNextOccurrences } from './predict-recurrence.presenter';
import { PredictedRecurrence } from '@domain';

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
    this._predictRecurrenceQuery$(PREDICT_RECURRENCE_FORM.value as string);

  private readonly _displayNextOccurrences: Subject<Date[]> = new Subject<Date[]>();
  private readonly _displayExplanation: BehaviorSubject<string> = new BehaviorSubject<string>('Pas de répétition active');
  public readonly displayNextOccurrences$: Observable<Date[]> = this._displayNextOccurrences.asObservable();
  public readonly displayExplanation$: Observable<string> = this._displayExplanation.asObservable();

  public readonly predictRecurrenceForm: FormGroup<PredictRecurrenceFields> = PREDICT_RECURRENCE_FORM;

  public constructor(@Inject(PREDICT_RECURRENCE_QUERY) private readonly _predictRecurrenceQuery$: PredictRecurrenceQuery) {}

  public onSubmitPredictRecurrence = (triggerAction: () => void): void => {
    PREDICT_RECURRENCE_FORM.markAllAsTouched();
    PREDICT_RECURRENCE_FORM.valid && triggerAction();
  };

  public onPredictRecurrenceQuerySuccess = (predictedRecurrence: PredictedRecurrence): void => {
    this._displayNextOccurrences.next(getNextOccurrences(predictedRecurrence.recurrence, this.fromDate, 6));
    this._displayExplanation.next(predictedRecurrence.explanation);
  };

  public onPredictRecurrenceQueryError = (error: Error): void => {
    setPredictRecurrenceErrorToForm(formatPredictRecurrenceError(error));
  };
}
