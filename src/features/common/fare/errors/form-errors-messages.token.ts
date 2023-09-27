type FormControlErrorsNames = 'fare' | 'search';

export const FARE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  fare: (): string => `La course est invalide`,
  search: (): string => `La sélection est invalide`
};
