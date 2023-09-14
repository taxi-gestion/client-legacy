export type FormControlErrorsNames = 'lastname';

export const FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  lastname: (controlValue: unknown): string =>
    `Une valeur est obligatoire pour le nom de famille: "${String(controlValue)}" est incorrect`
};
