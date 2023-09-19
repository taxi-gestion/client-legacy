type FormControlErrorsNames = 'phoneToCall' | 'search';

export const PHONE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  phoneToCall: (): string => `Le téléphone est invalide`,
  search: (): string => `Le téléphone est invalide`
};
