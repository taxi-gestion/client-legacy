import { ReturnToAffect, ReturnToAffectTransfer } from '../../providers';
import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';

export type FormattedAffectReturnError = { field?: string; errors: Record<string, unknown> };
export const formatAffectReturnError = (_error: Error): FormattedAffectReturnError => ({
  errors: { unknown: true }
});

export const toReturnToAffectTransfer = (formValues: ReturnToAffect): ReturnToAffectTransfer => ({
  fareId: formValues.fareId,
  driveFrom: formValues.driveFrom,
  driveTo: formValues.driveTo,
  planning: formValues.planning,
  datetime: datetimeLocalToIso8601UTCString(formValues.datetime)
});
