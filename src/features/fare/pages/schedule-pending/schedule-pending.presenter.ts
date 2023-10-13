import { Entity, PendingScheduled, ReturnDrive } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '@features/common/regular';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds, toTime } from '@features/common/presentation';
import { throwDecodeError } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { toWaypoint } from '@features/common/waypoint';
import { pendingFormCodec, ReturnToScheduleValues } from '../fare.form';

export const toSchedulePendingSuccessToast = (fares: PendingScheduled): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toReturnToSchedule = (rawFormValues: unknown): Entity & ReturnDrive =>
  fpipe(
    pendingFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleReturnFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (values: ReturnToScheduleValues): Entity & ReturnDrive => ({
  id: values.id,
  arrival: toWaypoint(values.arrivalPlace),
  datetime: datetimeLocalToIso8601UTCString(values.departureDatetime),
  departure: toWaypoint(values.departurePlace),
  distance: kilometersToMeters(values.driveDistance),
  driver: toDriver(values.driver),
  duration: minutesToSeconds(values.driveDuration),
  status: 'return-drive'
});
