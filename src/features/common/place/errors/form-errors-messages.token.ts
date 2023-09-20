type FormControlErrorsNames = 'place' | 'search';

export const PLACE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  place: (controlValue: unknown): string => `L'adresse "${String(controlValue)}" est invalide`,
  search: (controlValue: unknown): string => `L'adresse "${String(controlValue)}" est invalide`
};
