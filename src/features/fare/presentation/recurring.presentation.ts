import { Entity, Recurring } from '../../../definitions';

export type RecurringPresentation = Omit<Entity & Recurring, 'recurrence'> & {
  recurrenceDisplay: string;
  startLater: string;
};
