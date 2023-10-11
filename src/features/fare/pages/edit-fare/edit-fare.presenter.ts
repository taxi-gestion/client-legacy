import { Entity, FaresEdited, ToEdit } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '@features/common/regular';
import {
  datetimeLocalToIso8601UTCString,
  kilometersToMeters,
  minutesToSeconds,
  toKind,
  toNature,
  toTime
} from '@features/common/presentation';
import { editFareFormCodec, FareToEditValues } from '../fare.form';
import { throwDecodeError } from '@features/common/form-validation';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toPlace } from '@features/common/place';
import { toDriver } from '@features/common/driver';
import { toPassenger } from '@features/fare';

export const toEditFareSuccessToast = (fares: FaresEdited): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledEdited.passenger)} par ${fares.scheduledEdited.driver.username} à ${toTime(
    fares.scheduledEdited.datetime
  )} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToEdit = (rawFormValues: unknown): Entity & ToEdit =>
  fpipe(editFareFormCodec.decode(rawFormValues), eitherFold(throwDecodeError('editFareFormCodec', rawFormValues), toDomain));

export const toDomain = (values: FareToEditValues): Entity & ToEdit => ({
  id: values.id,
  destination: toPlace(values.arrivalPlace.place),
  datetime: datetimeLocalToIso8601UTCString(values.departureDatetime),
  departure: toPlace(values.departurePlace),
  distance: kilometersToMeters(values.driveDistance),
  driver: toDriver(values.driver),
  duration: minutesToSeconds(values.driveDuration),
  kind: toKind(values.isTwoWayDrive),
  nature: toNature(values.isMedicalDrive),
  passenger: toPassenger(values),
  status: 'to-edit'
});
