import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToScheduleValues, scheduleFareFormCodec } from './schedule-fare.form';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { FaresScheduled, RegularDetails, ToSchedule } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { regularToPassenger, toLocalTime } from '../../common/fares.presenter';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { throwDecodeError } from '../../common/regular.presenter';
import { PhoneValues, toPhoneValues } from '@features/common/phone';
import { DestinationValues, toDestinationValues } from '@features/common/destination';
import { toPlace } from '@features/common/place';
import { toDriver } from '../../../common/driver/driver.presenter';
import { toIdentity } from '@features/common/regular';

export const toScheduleFareSuccessToast = (fares: FaresScheduled): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledCreated.passenger)} par ${
    fares.scheduledCreated.driver.username
  } à ${toLocalTime(fares.scheduledCreated.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToSchedule = (rawFormValues: unknown): ToSchedule =>
  fpPipe(
    scheduleFareFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('scheduleFareFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: FareToScheduleValues): ToSchedule => ({
  destination: toPlace(formValues.arrivalPlace.place),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toPlace(formValues.departurePlace),
  distance: kilometersToMeters(formValues.driveDistance),
  driver: toDriver(formValues.driver),
  duration: minutesToSeconds(formValues.driveDuration),
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: regularToPassenger(formValues),
  status: 'to-schedule'
});

export const toFirstPhone = (regular: RegularDetails): PhoneValues | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  regular.phones === undefined || regular.phones.length === 0 ? undefined : toPhoneValues(regular.phones.at(0)!);

export const toFirstDestination = (regular: RegularDetails): DestinationValues | undefined =>
  regular.destinations === undefined || regular.destinations.length === 0
    ? undefined
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      toDestinationValues(regular.destinations.at(0)!);

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedScheduleFareError = { field?: string; errors: Record<string, unknown> };
export const formatScheduleFareError = (error: Error): FormattedScheduleFareError =>
  scheduleFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const scheduleFareErrorFormatMap: Map<string, (error: Error) => FormattedScheduleFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedScheduleFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
