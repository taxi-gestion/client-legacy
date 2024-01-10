import { EditScheduled, Entity, ToScheduledEdited } from '@definitions';
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
import { editScheduledFormCodec } from '../fare.form';
import { throwDecodeError } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { ScheduledToEditValues, toPassenger } from '@features/fare';
import { toWaypoint } from '@features/common/waypoint';

export const toEditScheduledSuccessToast = (fares: EditScheduled): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledEdited.passenger)} par ${fares.scheduledEdited.driver.username} à ${toTime(
    fares.scheduledEdited.datetime
  )} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toScheduledToEdit = (rawFormValues: unknown): Entity & ToScheduledEdited =>
  fpipe(
    editScheduledFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('editScheduledFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (values: ScheduledToEditValues): Entity & ToScheduledEdited => ({
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
  status: 'to-scheduled-edited',
  creator: 'manager'
});
