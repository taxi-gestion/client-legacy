import { ReturnToAffectTransfer } from '../../../providers';

export type FormattedAffectReturnError = { field?: string; errors: Record<string, unknown> };
export const formatAffectReturnError = (_error: Error): FormattedAffectReturnError => ({
  errors: { unknown: true }
});

const timeToIso8601String = (time: string): string => `T${time}`;
export const toReturnToAffectTransfer = (formValues: ReturnToAffectTransfer): ReturnToAffectTransfer => ({
  fareId: formValues.fareId,
  driveFrom: formValues.driveFrom,
  driveTo: formValues.driveTo,
  planning: formValues.planning,
  startTime: timeToIso8601String(formValues.startTime)
});
