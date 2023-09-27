import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, Journey, PendingScheduled, ReturnDrive } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { PendingToScheduleValues, schedulePendingFormCodec } from './schedule-pending.form';
import { PlaceValues, toPlace } from '@features/common/place';
import { toIdentity } from '@features/common/regular';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { throwDecodeError } from '../../common/regular.presenter';
import { toDriver } from '@features/common/driver';
import { journeyCodec } from '@codecs';
import { max } from 'date-fns';

export const toSchedulePendingSuccessToast = (pending: PendingScheduled): Toast => ({
  content: `Course de retour pour ${toIdentity(pending.scheduledCreated.passenger)} par ${
    pending.scheduledCreated.driver.username
  } à ${toLocalTime(pending.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Un retour a été planifié'
});

export const toPendingToSchedule = (rawFormValues: unknown): Entity & ReturnDrive =>
  fpPipe(
    schedulePendingFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleReturnFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: Entity & PendingToScheduleValues): Entity & ReturnDrive => ({
  id: formValues.id,
  departure: toPlace(formValues.departurePlace),
  destination: toPlace(formValues.arrivalPlace),
  driver: toDriver(formValues.driver),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  distance: kilometersToMeters(formValues.driveDistance),
  duration: minutesToSeconds(formValues.driveDuration),
  status: 'return-drive'
});

const toJourneyDomain = (formValues: {
  departurePlace: PlaceValues;
  arrivalPlace: PlaceValues;
  departureDatetime: string;
}): unknown => ({
  origin: formValues.departurePlace,
  destination: formValues.arrivalPlace,
  departureTime: datetimeLocalToIso8601UTCString(formValues.departureDatetime)
});

// TODO Import some rule codecs, should use a local journeyFormCodec with date and places rules
export const toJourney = (rawFormValues: unknown): Journey => {
  const tempUgly: unknown = toJourneyDomain(
    rawFormValues as { departurePlace: PlaceValues; arrivalPlace: PlaceValues; departureDatetime: string }
  );
  return fpPipe(
    journeyCodec.decode(tempUgly),
    eitherFold(throwDecodeError('journeyCodec', rawFormValues), (values: Journey): Journey => values)
  );
};

export const nowOrLater = (datetime: string): Date => {
  const now: Date = new Date();
  const later: Date = new Date(datetime);

  return max([now, later]);
};

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedSchedulePendingError = { field?: string; errors: Record<string, unknown> };

export const formatSchedulePendingError = (error: Error): FormattedSchedulePendingError =>
  schedulePendingErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const schedulePendingErrorFormatMap: Map<string, (error: Error) => FormattedSchedulePendingError> = new Map([
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedSchedulePendingError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
