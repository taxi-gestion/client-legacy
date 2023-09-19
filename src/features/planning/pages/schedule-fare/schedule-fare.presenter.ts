import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToScheduleValues, scheduleFareFormCodec } from './schedule-fare.form';
import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FaresScheduled, RegularDetails, ToSchedule } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { defaultPlaceValue, regularToPassenger, toFormPassenger, toLocalTime } from '../../common/fares.presenter';
import { pipe as fpPipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { throwDecodeError } from '../../common/regular.presenter';
import { toDestinationValues } from '../manage-regular/manage-regular.presenter';
import { DestinationValues } from '../../components';
import { FormGroup } from '@angular/forms';
import { FareFields } from '../../common/fares.presentation';
import { PhoneValues, toPhoneValues } from '../../../common/phone';

export const toScheduleFareSuccessToast = (fares: FaresScheduled): Toast => ({
  content: `Course pour ${fares.scheduledCreated.passenger.identity} par ${
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
  destination: formValues.arrivalPlace,
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: formValues.departurePlace,
  distance: kilometersToMeters(formValues.driveDistance),
  driver: formValues.driver,
  duration: minutesToSeconds(formValues.driveDuration),
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: regularToPassenger(formValues),
  status: 'to-schedule'
});

export const updateRegularLinkedControls =
  (form: FormGroup<FareFields>) =>
  (regular: Entity & RegularDetails): void => {
    form.controls.passenger.setValue(toFormPassenger(regular));
    form.controls.departurePlace.setValue(regular.home ?? defaultPlaceValue);
    const firstDestination: DestinationValues | undefined = toFirstDestination(regular);
    form.controls.arrivalPlace.setValue(firstDestination?.place ?? defaultPlaceValue);
    form.controls.isMedicalDrive.setValue(firstDestination?.isMedicalDrive ?? true);
    form.controls.isTwoWayDrive.setValue(firstDestination?.isTwoWayDrive ?? true);
  };

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
