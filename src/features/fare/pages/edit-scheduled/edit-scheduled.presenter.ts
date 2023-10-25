import { DeleteFare, EditScheduled, Entity, Pending, Scheduled, ToScheduledEdited, Unassigned } from '@definitions';
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
  status: 'to-scheduled-edited'
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const toDeleteFareSuccessToasts = (fares: DeleteFare): Toast[] => [
  ...(fares.scheduledDeleted === undefined ? [] : [toDeleteScheduledSuccessToast(fares.scheduledDeleted)]),
  ...(fares.unassignedDeleted === undefined ? [] : [toDeleteUnassignedSuccessToast(fares.unassignedDeleted)]),
  ...(fares.pendingDeleted === undefined ? [] : [toDeletePendingSuccessToast(fares.pendingDeleted)])
];
/* eslint-enable @typescript-eslint/no-non-null-assertion */

const toDeleteScheduledSuccessToast = (scheduled: Scheduled): Toast => ({
  content: `Course pour ${toIdentity(scheduled.passenger)} par ${scheduled.driver.username} à ${toTime(
    scheduled.datetime
  )} supprimée`,
  status: 'success',
  title: 'Une course a été supprimée'
});

const toDeleteUnassignedSuccessToast = (unassigned: Unassigned): Toast => ({
  content: `Course non assignée pour ${toIdentity(unassigned.passenger)} à ${toTime(unassigned.datetime)} supprimée`,
  status: 'success',
  title: 'Une course a été supprimée'
});

const toDeletePendingSuccessToast = (pending: Pending): Toast => ({
  content: `Retour pour ${toIdentity(pending.passenger)} par ${pending.driver.username} supprimé`,
  status: 'success',
  title: 'Un retour a été supprimé'
});
