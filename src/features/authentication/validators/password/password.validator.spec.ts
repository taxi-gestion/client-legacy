import { FormControl, ValidationErrors } from '@angular/forms';
import { passwordValidator } from './password.validator';

describe('username validator', (): void => {
  it('should not get error with valid password', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('r*4Zv^Eh'));

    expect(errors).toEqual(null);
  });

  it('should get missing special char error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('r04Zv0Eh'));

    expect(errors).toEqual({ missingSpecialChar: { value: 'r04Zv0Eh' } });
  });

  it('should get missing number error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('r*eZv^Eh'));

    expect(errors).toEqual({ missingNumber: { value: 'r*eZv^Eh' } });
  });

  it('should get missing uppercase char error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('r*4zv^eh'));

    expect(errors).toEqual({ missingUppercaseChar: { value: 'r*4zv^eh' } });
  });

  it('should get missing lowercase char error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('R*4ZV^EH'));

    expect(errors).toEqual({ missingLowercaseChar: { value: 'R*4ZV^EH' } });
  });

  it('should get forbidden leading space error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl(' r*4Zv^Eh'));

    expect(errors).toEqual({ forbiddenLeadingSpace: { value: ' r*4Zv^Eh' } });
  });

  it('should get forbidden trailing space error', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('r*4Zv^Eh '));

    expect(errors).toEqual({ forbiddenTrailingSpace: { value: 'r*4Zv^Eh ' } });
  });

  it('should get all password errors together except heading and trailing spaces', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl('££££££££'));

    expect(errors).toEqual({
      missingSpecialChar: { value: '££££££££' },
      missingNumber: { value: '££££££££' },
      missingUppercaseChar: { value: '££££££££' },
      missingLowercaseChar: { value: '££££££££' }
    });
  });

  it('should get all password errors together except special chars', (): void => {
    const errors: ValidationErrors | null = passwordValidator(new FormControl(' ££££££££ '));

    expect(errors).toEqual({
      missingNumber: { value: ' ££££££££ ' },
      missingUppercaseChar: { value: ' ££££££££ ' },
      missingLowercaseChar: { value: ' ££££££££ ' },
      forbiddenLeadingSpace: { value: ' ££££££££ ' },
      forbiddenTrailingSpace: { value: ' ££££££££ ' }
    });
  });
});
