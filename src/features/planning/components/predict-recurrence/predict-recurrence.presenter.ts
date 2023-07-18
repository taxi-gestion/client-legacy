import { CronExpression, parseExpression } from 'cron-parser';

export type FormattedPredictRecurrenceError = { field?: string; errors: Record<string, unknown> };
export const formatPredictRecurrenceError = (_error: Error): FormattedPredictRecurrenceError => ({
  errors: { unknown: true }
});

export const getNextOccurrences = (cronString: string, fromDate: Date, maxOccurrences: number = 3): Date[] => {
  try {
    const interval: CronExpression = parseExpression(cronString, { currentDate: fromDate });
    const nextOccurrences: Date[] = [];

    for (let i: number = 0; i < maxOccurrences; i++) {
      nextOccurrences.push(interval.next().toDate());
    }

    return nextOccurrences;
  } catch {
    return [];
  }
};
