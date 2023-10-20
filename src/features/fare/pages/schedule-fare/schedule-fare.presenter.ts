import { scheduleFareFormCodec } from '../fare.form';
import { ScheduleScheduled, ToScheduled } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { toIdentity } from '@features/common/regular';
import { throwDecodeError } from '@features/common/form-validation';
import {
  datetimeLocalToIso8601UTCString,
  kilometersToMeters,
  minutesToSeconds,
  toKind,
  toNature,
  toTime
} from '@features/common/presentation';

import { FareToScheduleValues, toPassenger } from '@features/fare';
import { toWaypoint } from '@features/common/waypoint';

export const toScheduleFareSuccessToast = (fares: ScheduleScheduled): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToSchedule = (rawFormValues: unknown): ToScheduled =>
  fpipe(
    scheduleFareFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleFareFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: FareToScheduleValues): ToScheduled => ({
  arrival: toWaypoint(formValues.arrivalPlace),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toWaypoint(formValues.departurePlace),
  distance: kilometersToMeters(formValues.driveDistance),
  driver: toDriver(formValues.driver),
  duration: minutesToSeconds(formValues.driveDuration),
  kind: toKind(formValues.isTwoWayDrive),
  nature: toNature(formValues.isMedicalDrive),
  passenger: toPassenger(formValues),
  status: 'to-scheduled'
});
