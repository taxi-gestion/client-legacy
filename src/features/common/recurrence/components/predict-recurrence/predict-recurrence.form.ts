import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PredictRecurrence } from '@domain';

export type PredictRecurrenceFields = {
  query: FormControl<string>;
};

export const PREDICT_RECURRENCE_FORM: FormGroup<Record<keyof PredictRecurrence, FormControl>> = new FormGroup<
  Record<keyof PredictRecurrence, FormControl>
>({
  query: new FormControl<PredictRecurrence['query']>('', [Validators.required])
});

export const setPredictRecurrenceErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? PREDICT_RECURRENCE_FORM.setErrors(handledError.errors)
    : PREDICT_RECURRENCE_FORM.get(handledError.field)?.setErrors(handledError.errors);
