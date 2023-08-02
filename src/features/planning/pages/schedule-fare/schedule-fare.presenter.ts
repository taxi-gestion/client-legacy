import { FareToSchedule, FareToScheduleTransfer } from '../../providers';
import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';

export type FormattedScheduleFareError = { field?: string; errors: Record<string, unknown> };
export const formatScheduleFareError = (_error: Error): FormattedScheduleFareError => ({
  errors: { unknown: true }
});

export const toFareToScheduleTransfer = (formValues: FareToSchedule): FareToScheduleTransfer => ({
  clientIdentity: formValues.clientIdentity,
  clientPhone: formValues.clientPhone,
  datetime: datetimeLocalToIso8601UTCString(formValues.datetime),
  driveFrom: formValues.driveFrom,
  driveKind: formValues.driveKind,
  driveNature: formValues.driveNature,
  driveTo: formValues.driveTo,
  planning: formValues.planning,
  recurrence: formValues.recurrence,
  distance: formValues.distance,
  duration: formValues.duration
});
