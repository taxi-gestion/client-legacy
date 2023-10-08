import { Entity, FaresEdited, ToEdit } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '@features/common/regular';
import { datetimeLocalToIso8601UTCString, toTime } from '@features/common/presentation';
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

export const toDomain = (formValues: FareToEditValues): Entity & ToEdit => ({
  id: formValues.id,
  destination: toPlace(formValues.arrivalPlace.place),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toPlace(formValues.departurePlace),
  // TODO ReAdd After estimate-journey refactor
  distance: 0, // kilometersToMeters(formValues.driveDistance),
  driver: toDriver(formValues.driver),
  // TODO ReAdd After estimate-journey refactor
  duration: 0, // minutesToSeconds(formValues.driveDuration),
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: toPassenger(formValues),
  status: 'to-edit'
});
