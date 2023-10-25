import { Entity, SchedulePending, PendingToScheduled } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '@features/regular';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds, toTime } from '@features/common/presentation';
import { throwDecodeError } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { toWaypoint } from '@features/common/waypoint';
import { pendingFormCodec } from '../fare.form';
import { ReturnToScheduleValues } from '@features/fare';

export const toSchedulePendingSuccessToast = (fares: SchedulePending): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toReturnToSchedule = (rawFormValues: unknown): Entity & PendingToScheduled =>
  fpipe(
    pendingFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleReturnFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (values: ReturnToScheduleValues): Entity & PendingToScheduled => ({
  id: values.id,
  arrival: toWaypoint(values.arrivalPlace),
  datetime: datetimeLocalToIso8601UTCString(values.departureDatetime),
  departure: toWaypoint(values.departurePlace),
  distance: kilometersToMeters(values.driveDistance),
  driver: toDriver(values.driver),
  duration: minutesToSeconds(values.driveDuration),
  status: 'pending-to-scheduled'
});
