type FormControlErrorsNames = 'regular' | 'search';

export const REGULAR_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  regular: (): string => `Le passager est invalide`,
  search: (): string => `Le passager est invalide`
};
