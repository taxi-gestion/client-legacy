type FormControlErrorsNames = 'destination' | 'search';

export const DESTINATION_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  destination: (controlValue: unknown): string => `La destination "${String(controlValue)}" est invalide`,
  search: (): string => `Une destination enregistrée sur la fiche passager est obligatoire`
};
