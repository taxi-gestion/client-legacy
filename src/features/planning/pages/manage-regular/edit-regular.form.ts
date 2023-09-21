import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegularFields, regularFormCodec, regularFormControls } from '../../common/regular.presentation';
import { intersection as ioIntersection, type as ioType, Type } from 'io-ts';
import { regularEmptyValue, RegularValues, regularValuesEntityCodec } from '@features/common/regular';
import { RegularField } from '../../../common/regular/components/regular-field/regular-field.form';
import { Entity } from '@definitions';

export type EditRegularValues = RegularValues & {
  regular: Entity & RegularValues;
};

export const editRegularFormCodec: Type<EditRegularValues> = ioIntersection([
  ioType({
    regular: regularValuesEntityCodec
  }),
  regularFormCodec
]);

export type EditRegularFields = RegularField<'regular'> & RegularFields;

export const EDIT_REGULAR_FORM: FormGroup<EditRegularFields> = new FormGroup<EditRegularFields>({
  regular: new FormControl<EditRegularValues['regular']>(regularEmptyValue, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...regularFormControls()
});

export const setEditRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_REGULAR_FORM.setErrors(handledError.errors)
    : EDIT_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
