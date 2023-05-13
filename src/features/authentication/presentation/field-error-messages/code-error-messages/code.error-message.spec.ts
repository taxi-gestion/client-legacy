import { INVALID_CODE_ERROR_NAME, InvalidCodeError } from '../../../errors';
import { fieldErrorMessagesPresentation } from '../field-error-messages.presentation';
import { CODE_ERROR_MESSAGES, CodeErrors } from './code.error-message';

describe('code error messages', (): void => {
  it('should not get any code error message', (): void => {
    const errors: CodeErrors = null;

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, CODE_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual([]);
  });

  it('should get required code error message', (): void => {
    const errors: CodeErrors = { required: true };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, CODE_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(["Saisissez le code d'activation"]);
  });

  it('should get invalid code error message', (): void => {
    const errors: CodeErrors = { [INVALID_CODE_ERROR_NAME]: new InvalidCodeError('19561') };

    const errorMessage: string[] = fieldErrorMessagesPresentation(errors, CODE_ERROR_MESSAGES);

    expect(errorMessage).toStrictEqual(["Le code 19561 n'est pas valide"]);
  });
});
