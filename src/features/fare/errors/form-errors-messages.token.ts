type FormControlErrorsNames =
  | 'arrivalPlace'
  | 'departureDatetime'
  | 'departurePlace'
  | 'destinationName'
  | 'lastname'
  | 'phoneNumber'
  | 'phoneToCall'
  | 'phoneType'
  | 'search';

export const FARE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  phoneType: (): string => `Une valeur est obligatoire pour le type de téléphone.`,
  phoneNumber: (controlValue: unknown): string =>
    `Le numéro de téléphone: "${String(controlValue)}" ne respecte pas le format français.`,
  lastname: (): string => `Une valeur est obligatoire pour le nom de famille.`,
  destinationName: (): string => `Une valeur est obligatoire pour la destination.`,
  phoneToCall: (controlValue: unknown): string =>
    `Le numéro de téléphone: "${String(controlValue)}" ne respecte pas le format français.`,
  departureDatetime: (): string => `L'heure sélectionnée est invalide`,
  departurePlace: (): string => `Le lieu de départ est invalide`,
  arrivalPlace: (): string => `La destination est invalide`,
  search: (): string => `La sélection est invalide`
};
