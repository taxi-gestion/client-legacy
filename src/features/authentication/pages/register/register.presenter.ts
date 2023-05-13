import { ACCOUNT_ALREADY_EXIST_ERROR_NAME } from '../../errors';

export type FormattedRegisterError = { field?: string; errors: Record<string, unknown> };

const registerErrorFormatMap: Map<string, (error: Error) => FormattedRegisterError> = new Map([
  [
    ACCOUNT_ALREADY_EXIST_ERROR_NAME,
    (error: Error) => ({
      field: 'username',
      errors: {
        [ACCOUNT_ALREADY_EXIST_ERROR_NAME]: error
      }
    })
  ]
]);

export const formatRegisterError = (error: Error): FormattedRegisterError =>
  registerErrorFormatMap.get(error.name)?.(error) ?? { errors: { unknown: true } };
