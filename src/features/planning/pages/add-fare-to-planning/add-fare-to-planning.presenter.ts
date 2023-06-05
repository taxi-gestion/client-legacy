import { format } from 'date-fns';

export type FormattedAddFareToPlanningError = { field?: string; errors: Record<string, unknown> };
export const formatAddFaresToPlanningError = (_error: Error): FormattedAddFareToPlanningError => ({
  errors: { unknown: true }
});

export const formatDate = (date: Date): string => format(date, 'dd/MM/yyyy');
