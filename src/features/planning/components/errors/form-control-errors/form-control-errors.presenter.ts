export type FormControlErrorsNames = 'destinationName' | 'lastname' | 'phoneNumber' | 'phoneType';

export const FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  phoneType: (): string => `Une valeur est obligatoire pour le type de téléphone.`,
  phoneNumber: (controlValue: unknown): string =>
    `Le numéro de téléphone: "${String(controlValue)}" ne respecte pas le format français.`,
  lastname: (): string => `Une valeur est obligatoire pour le nom de famille.`,
  destinationName: (): string => `Une valeur est obligatoire pour la destination.`
};
