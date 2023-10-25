import { FormGroup } from '@angular/forms';
import { Type } from 'io-ts';
import { RegularFields, regularFormCodec, regularFormControls } from '../../common/regular.presentation';
import { RegularValues } from '@features/regular';

export type RegisterRegularValues = RegularValues;

export const registerRegularFormCodec: Type<RegisterRegularValues> = regularFormCodec;

export type RegisterRegularFields = RegularFields;

export const REGISTER_REGULAR_FORM: FormGroup<RegisterRegularFields> = new FormGroup<RegisterRegularFields>({
  ...regularFormControls()
});

export const setRegisterRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? REGISTER_REGULAR_FORM.setErrors(handledError.errors)
    : REGISTER_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
