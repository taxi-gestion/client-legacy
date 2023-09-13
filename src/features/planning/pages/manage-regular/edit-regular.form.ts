import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegularFields, regularFormCodec, regularFormControls, RegularValues } from '../../common/regular.presentation';
import { intersection as ioIntersection, string as ioString, type as ioType, Type } from 'io-ts';

export type EditRegularValues = RegularValues & {
  regularId: string;
};

export const editRegularFormCodec: Type<EditRegularValues> = ioIntersection([
  ioType({
    regularId: ioString
  }),
  regularFormCodec
]);

export type EditRegularFields = RegularFields & {
  regularId: FormControl<EditRegularValues['regularId']>;
};

export const EDIT_REGULAR_FORM: FormGroup<EditRegularFields> = new FormGroup<EditRegularFields>({
  regularId: new FormControl<EditRegularValues['regularId']>('', { nonNullable: true, validators: [Validators.required] }),
  ...regularFormControls()
});

export const setEditRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_REGULAR_FORM.setErrors(handledError.errors)
    : EDIT_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
