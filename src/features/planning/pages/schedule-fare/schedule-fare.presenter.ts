import { format } from 'date-fns';

export type FormattedScheduleFareError = { field?: string; errors: Record<string, unknown> };
export const formatScheduleFareError = (_error: Error): FormattedScheduleFareError => ({
  errors: { unknown: true }
});

export const formatDate = (date: Date): string => format(date, 'dd/MM/yyyy');
