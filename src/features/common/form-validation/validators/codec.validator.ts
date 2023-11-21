import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isRight } from 'fp-ts/Either';
import { null as ioNull, Type, undefined as ioUndefined, union as ioUnion, Validation } from 'io-ts';
import { isTimeISO8601String } from '../../../../codecs/rules/timeISO8601.rule';

export const codecControlValidator =
  <OutputType, OriginalType = OutputType, InputType = unknown>(
    codec: Type<OutputType, OriginalType, InputType>,
    errorKey: string
  ): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    // type assertion is ok because we're typechecking the codec just after anyway
    const validation: Validation<OutputType> = codec.decode(control.value as InputType);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return isRight(validation) ? null : { [errorKey]: control.value };
  };

export const timeOrUndefinedOrNullValidator: ValidatorFn = codecControlValidator(
  ioUnion([isTimeISO8601String, ioUndefined, ioNull]),
  'invalidTime'
);
export const timeValidator: ValidatorFn = codecControlValidator(isTimeISO8601String, 'invalidTime');
