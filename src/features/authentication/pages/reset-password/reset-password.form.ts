import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '@features/authentication/validators';

export type ResetPasswordForm = {
  username: string;
  password: string;
  code: string;
};

export const RESET_PASSWORD_FORM: FormGroup<Record<keyof ResetPasswordForm, FormControl>> = new FormGroup<
  Record<keyof ResetPasswordForm, FormControl>
>({
  username: new FormControl<ResetPasswordForm['username']>('', [Validators.required]),
  password: new FormControl<ResetPasswordForm['password']>('', [
    Validators.required,
    Validators.minLength(8),
    passwordValidator
  ]),
  code: new FormControl<ResetPasswordForm['code']>('', [Validators.required])
});

export const setResetPasswordErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void => {
  handledError.field
    ? RESET_PASSWORD_FORM.get(handledError.field)?.setErrors(handledError.errors)
    : RESET_PASSWORD_FORM.setErrors(handledError.errors);
};
