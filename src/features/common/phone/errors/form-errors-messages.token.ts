type FormControlErrorsNames = 'phoneToCall' | 'search';

export const PHONE_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  phoneToCall: (controlValue: unknown): string => `Le téléphone "${String(controlValue)}" est invalid`,
  search: (): string => `Un téléphone enregistré sur la fiche passager est obligatoire`
};
