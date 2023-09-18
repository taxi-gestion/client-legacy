type FormControlErrorsNames = 'driver';

export const DRIVER_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  driver: (): string => `Le chauffeur est invalide`
};
