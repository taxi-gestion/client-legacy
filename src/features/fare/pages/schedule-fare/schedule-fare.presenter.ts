import { FareToScheduleValues, scheduleFareFormCodec } from '../fare.form';
import { FaresScheduled, ToSchedule } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toPlace } from '@features/common/place';
import { toDriver } from '../../../common/driver/driver.presenter';
import { toIdentity } from '@features/common/regular';
import { throwDecodeError } from '@features/common/form-validation';
import { datetimeLocalToIso8601UTCString, toKind, toNature, toTime } from '@features/common/presentation';

import { toPassenger } from '@features/fare';

export const toScheduleFareSuccessToast = (fares: FaresScheduled): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToSchedule = (rawFormValues: unknown): ToSchedule =>
  fpipe(
    scheduleFareFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleFareFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: FareToScheduleValues): ToSchedule => ({
  destination: toPlace(formValues.arrivalPlace.place),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toPlace(formValues.departurePlace),
  // TODO ReAdd After estimate-journey refactor
  distance: 0, // kilometersToMeters(formValues.driveDistance),
  driver: toDriver(formValues.driver),
  // TODO ReAdd After estimate-journey refactor
  duration: 0, // minutesToSeconds(formValues.driveDuration),
  kind: toKind(formValues.isTwoWayDrive),
  nature: toNature(formValues.isMedicalDrive),
  passenger: toPassenger(formValues),
  status: 'to-schedule'
});
