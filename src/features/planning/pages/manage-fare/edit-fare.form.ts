import { FormGroup } from '@angular/forms';
import { Entity } from '@definitions';
import { FareFields, fareFormCodec, fareFormControls, FareValues } from '../../common/fares.presentation';
import { Type, intersection as ioIntersection } from 'io-ts';
import { entityCodec } from '@codecs';

export type FareToEditValues = Entity & FareValues;

export type EditFareFields = FareFields;

export const editFareFormCodec: Type<FareToEditValues> = ioIntersection([entityCodec, fareFormCodec]);

export const EDIT_FARE_FORM: FormGroup<EditFareFields> = new FormGroup<EditFareFields>({
  ...fareFormControls()
});

export const setEditFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_FARE_FORM.setErrors(handledError.errors)
    : EDIT_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
