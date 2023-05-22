import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { isPhone } from '../../presentation';

const isPhoneOrEmail = (control: FormControl<string | null>): boolean =>
  isPhone(control.value ?? '') || Validators.email(control) == null;

export const usernameValidator = (control: FormControl<string | null>): ValidationErrors | null =>
  isPhoneOrEmail(control) ? null : { invalidUsername: { username: control.value } };
