import { FormControl, FormGroup, Validators } from '@angular/forms';

export type RegisterRegularPresentation = {
  firstname: string;
  lastname: string;
  phoneToAutocomplete: string;
};

export type RegisterRegularFields = {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  phoneToAutocomplete: FormControl<string>;
};

export const REGISTER_REGULAR_FORM: FormGroup<Record<keyof RegisterRegularPresentation, FormControl>> = new FormGroup<
  Record<keyof RegisterRegularPresentation, FormControl>
>({
  firstname: new FormControl<RegisterRegularPresentation['firstname']>('', [Validators.required]),
  lastname: new FormControl<RegisterRegularPresentation['lastname']>('', [Validators.required]),
  phoneToAutocomplete: new FormControl<RegisterRegularPresentation['phoneToAutocomplete']>('', [Validators.required])
});

export const setRegisterRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? REGISTER_REGULAR_FORM.setErrors(handledError.errors)
    : REGISTER_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
