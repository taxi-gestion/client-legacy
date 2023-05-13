import { FormControl, FormGroup, Validators } from '@angular/forms';

export type LoginFormValues = {
  username: string;
  password: string;
};

export const LOGIN_FORM: FormGroup<Record<keyof LoginFormValues, FormControl>> = new FormGroup<
  Record<keyof LoginFormValues, FormControl>
>({
  username: new FormControl<LoginFormValues['username']>('', [Validators.required]),
  password: new FormControl<LoginFormValues['password']>('', [Validators.required])
});

export const setLoginErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void => {
  handledError.field
    ? LOGIN_FORM.get(handledError.field)?.setErrors(handledError.errors)
    : LOGIN_FORM.setErrors(handledError.errors);
};
