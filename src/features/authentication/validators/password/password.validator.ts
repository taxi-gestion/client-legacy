import { FormControl, ValidationErrors } from '@angular/forms';

type PasswordValidationError =
  | 'forbiddenLeadingSpace'
  | 'forbiddenTrailingSpace'
  | 'missingLowercaseChar'
  | 'missingNumber'
  | 'missingSpecialChar'
  | 'missingUppercaseChar';

type PasswordValidationCheck = {
  regexp: RegExp;
  passwordValidationError: PasswordValidationError;
};

const SPECIAL_CHAR_REGEXP: PasswordValidationCheck = {
  regexp: /[$*.^\][{}()?\-"!@#%&/\\,><':;|_~`+=\s]/u,
  passwordValidationError: 'missingSpecialChar'
};

const NUMBER_REGEXP: PasswordValidationCheck = {
  regexp: /[0-9]/u,
  passwordValidationError: 'missingNumber'
};

const UPPERCASE_CHAR_REGEXP: PasswordValidationCheck = {
  regexp: /[A-Z]/u,
  passwordValidationError: 'missingUppercaseChar'
};

const LOWERCASE_CHAR_REGEXP: PasswordValidationCheck = {
  regexp: /[a-z]/u,
  passwordValidationError: 'missingLowercaseChar'
};

const LEADING_SPACE_REGEXP: PasswordValidationCheck = {
  regexp: /^\S/u,
  passwordValidationError: 'forbiddenLeadingSpace'
};

const TRAILING_SPACE_REGEXP: PasswordValidationCheck = {
  regexp: /\S$/u,
  passwordValidationError: 'forbiddenTrailingSpace'
};

const PASSWORD_REGEXPS: PasswordValidationCheck[] = [
  SPECIAL_CHAR_REGEXP,
  NUMBER_REGEXP,
  UPPERCASE_CHAR_REGEXP,
  LOWERCASE_CHAR_REGEXP,
  LEADING_SPACE_REGEXP,
  TRAILING_SPACE_REGEXP
];

const appendValidationError =
  (validationErrors: ValidationErrors) =>
  (passwordValidationCheck: PasswordValidationCheck, control: FormControl<string | null>): ValidationErrors => ({
    ...validationErrors,
    [passwordValidationCheck.passwordValidationError]: { password: control.value }
  });

const toPasswordValidationErrors =
  (control: FormControl<string | null>) =>
  (validationErrors: ValidationErrors, passwordValidationCheck: PasswordValidationCheck): ValidationErrors =>
    passwordValidationCheck.regexp.test(control.value ?? '')
      ? validationErrors
      : appendValidationError(validationErrors)(passwordValidationCheck, control);

const validationErrorsOrNull = (validationErrors: ValidationErrors): ValidationErrors | null =>
  Object.keys(validationErrors).length === 0 ? null : validationErrors;

export const passwordValidator = (control: FormControl<string | null>): ValidationErrors | null =>
  validationErrorsOrNull(PASSWORD_REGEXPS.reduce(toPasswordValidationErrors(control), {}));
