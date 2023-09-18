import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Entity } from '@definitions';
import { FareFields, fareFormControls, FareValues } from '../../common/fares.presentation';

export type FareToEditValues = Entity & FareValues;

export type EditFareFields = FareFields & {
  id: FormControl<string>;
};

export const EDIT_FARE_FORM: FormGroup<Record<keyof FareToEditValues, FormControl>> = new FormGroup<
  Record<keyof FareToEditValues, FormControl>
>({
  id: new FormControl<FareToEditValues['id']>('', [Validators.required]),
  ...fareFormControls()
});

export const setEditFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_FARE_FORM.setErrors(handledError.errors)
    : EDIT_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
