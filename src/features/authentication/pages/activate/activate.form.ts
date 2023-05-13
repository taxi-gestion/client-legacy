import { FormControl, FormGroup, Validators } from '@angular/forms';

export type ActivateFormValues = {
  username: string;
  code: string;
};

export const ACTIVATE_FORM: FormGroup<Record<keyof ActivateFormValues, FormControl>> = new FormGroup<
  Record<keyof ActivateFormValues, FormControl>
>({
  username: new FormControl<ActivateFormValues['username']>('', [Validators.required]),
  code: new FormControl<ActivateFormValues['code']>('', [Validators.required])
});

export const setActivateErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void => {
  handledError.field
    ? ACTIVATE_FORM.get(handledError.field)?.setErrors(handledError.errors)
    : ACTIVATE_FORM.setErrors(handledError.errors);
};
