import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Entity } from '@definitions';
import { FareFields, fareFormControls, FareValues } from '../../common/fares.presentation';

export type FareToEditValues = Entity & FareValues;

export type EditFareFields = FareFields & {
  id: FormControl<FareToEditValues['id']>;
};

export const EDIT_FARE_FORM: FormGroup<EditFareFields> = new FormGroup<EditFareFields>({
  id: new FormControl<FareToEditValues['id']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...fareFormControls()
});

export const setEditFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_FARE_FORM.setErrors(handledError.errors)
    : EDIT_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
