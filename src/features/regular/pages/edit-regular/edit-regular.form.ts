import { FormGroup } from '@angular/forms';
import { RegularFields, regularFormCodec, regularFormControls } from '../../common/regular.presentation';
import { intersection as ioIntersection, Type } from 'io-ts';
import { RegularValues } from '@features/regular';
import { entityCodec } from '@codecs';
import { Entity } from '../../../../definitions';

export type EditRegularValues = RegularValues;

export const editRegularFormCodec: Type<EditRegularValues & Entity> = ioIntersection([entityCodec, regularFormCodec]);

export type EditRegularFields = RegularFields;

export const EDIT_REGULAR_FORM: FormGroup<EditRegularFields> = new FormGroup<EditRegularFields>({
  ...regularFormControls()
});

export const setEditRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_REGULAR_FORM.setErrors(handledError.errors)
    : EDIT_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
