import { Entity, ScheduleUnassigned, ToScheduled } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '@features/regular';
import {
  datetimeLocalToIso8601UTCString,
  kilometersToMeters,
  minutesToSeconds,
  toKind,
  toNature,
  toTime
} from '@features/common/presentation';
import { throwDecodeError } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { toWaypoint } from '@features/common/waypoint';

import { FareToScheduleValues, toPassenger } from '@features/fare';
import { unassignedToSchedule } from '../fare.form';

export const toScheduleUnassignedSuccessToast = (fares: ScheduleUnassigned): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toUnassignedToSchedule = (rawFormValues: unknown): Entity & ToScheduled =>
  fpipe(
    unassignedToSchedule.decode(rawFormValues),
    eitherFold(throwDecodeError('unassignedToScheduleFareFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (values: Entity & FareToScheduleValues): Entity & ToScheduled => ({
  id: values.id,
  arrival: toWaypoint(values.arrivalPlace),
  datetime: datetimeLocalToIso8601UTCString(values.departureDatetime),
  departure: toWaypoint(values.departurePlace),
  distance: kilometersToMeters(values.driveDistance),
  driver: toDriver(values.driver),
  duration: minutesToSeconds(values.driveDuration),
  kind: toKind(values.isTwoWayDrive),
  nature: toNature(values.isMedicalDrive),
  passenger: toPassenger(values),
  status: 'to-scheduled',
  creator: 'manager'
});
