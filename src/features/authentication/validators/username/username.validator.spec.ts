import { FormControl, ValidationErrors } from '@angular/forms';
import { usernameValidator } from './username.validator';

describe('username validator', (): void => {
  it('should get invalidUsername error', (): void => {
    const errors: ValidationErrors | null = usernameValidator(new FormControl('hello'));

    expect(errors).toEqual({ invalidUsername: { value: 'hello' } });
  });

  it('should not get error with valid phone', (): void => {
    const errors: ValidationErrors | null = usernameValidator(new FormControl('+33698214536'));

    expect(errors).toEqual(null);
  });

  it('should not get error with valid email', (): void => {
    const errors: ValidationErrors | null = usernameValidator(new FormControl('contact@taxi-gestion.com'));

    expect(errors).toEqual(null);
  });
});
