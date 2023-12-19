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
import { ScheduledFareValues, ScheduledToEditValues, toPassenger } from '@features/fare';
import { toWaypoint } from '@features/common/waypoint';
import { Params } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { fold as optionFold } from 'fp-ts/Option';
import { findFirst } from 'fp-ts/Array';

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

const UUID_LENGTH: 36 = 36 as const;
const isValidUuid = (uuid: unknown): uuid is string =>
  uuid === null || typeof uuid !== 'string' ? false : uuid.length === UUID_LENGTH;
export const routeParamToFareId = (keyInParams: string, params: Params): string | undefined => {
  const uuid: unknown = params[keyInParams];
  return isValidUuid(uuid) ? uuid : undefined;
};

export const findMatchingFare = ([fares, id]: [ScheduledFareValues[], string]): Observable<ScheduledFareValues> =>
  fpipe(
    fares,
    findFirst((fare: ScheduledFareValues): boolean => fare.id === id),
    optionFold(
      (): Observable<never> => throwError((): Error => new Error('Fare not found')),
      (fare: ScheduledFareValues): Observable<ScheduledFareValues> => of(fare)
    )
  );

export const toFareSummary = (fare: ScheduledFareValues): string => ` ${toTime(fare.datetime)} - ${toIdentity(fare.passenger)} -
        ${fare.arrival.place.label}`;
