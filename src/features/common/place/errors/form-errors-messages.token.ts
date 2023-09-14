type FormControlErrorsNames = 'place';

export const PLACE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  place: (): string => `L'adresse est invalide`
};
