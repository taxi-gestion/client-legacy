type FormControlErrorsNames = 'search' | 'waypoint';

export const WAYPOINT_FORM_CONTROL_ERROR_MESSAGES: Record<FormControlErrorsNames, (controlValue: unknown) => string> = {
  waypoint: (controlValue: unknown): string => `La waypoint "${String(controlValue)}" est invalide`,
  search: (): string => `Une destination enregistrée sur la fiche passager est obligatoire`
};
