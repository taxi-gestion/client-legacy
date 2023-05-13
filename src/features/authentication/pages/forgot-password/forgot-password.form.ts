import { FormControl, FormGroup, Validators } from '@angular/forms';

export type ForgotPasswordForm = {
  username: string;
};

export const FORGOT_PASSWORD_FORM: FormGroup<Record<keyof ForgotPasswordForm, FormControl>> = new FormGroup<
  Record<keyof ForgotPasswordForm, FormControl>
>({
  username: new FormControl<ForgotPasswordForm['username']>('', [Validators.required])
});

export const setForgotPasswordErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void => {
  handledError.field
    ? FORGOT_PASSWORD_FORM.get(handledError.field)?.setErrors(handledError.errors)
    : FORGOT_PASSWORD_FORM.setErrors(handledError.errors);
};
