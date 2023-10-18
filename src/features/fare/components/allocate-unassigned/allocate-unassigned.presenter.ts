import { AllocateUnassigned, ToUnassigned } from '@definitions';
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
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { throwDecodeError } from '@features/common/form-validation';
import { toWaypoint } from '@features/common/waypoint';
import { UnassignedToAllocateValues, toPassenger } from '@features/fare';
import { unassignedToAllocateFormCodec } from '../../pages/fare.form';

export const toUnassignedFareSuccessToast = (fares: AllocateUnassigned): Toast => ({
  content: `Course pour ${toIdentity(fares.unassignedCreated.passenger)} à ${toTime(
    fares.unassignedCreated.datetime
  )} ajouté aux courses à assigner`,
  status: 'success',
  title: 'Une course a été mise à assigner'
});

export const toUnassignedToAllocate = (rawFormValues: unknown): ToUnassigned =>
  fpipe(
    unassignedToAllocateFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('unassignedFareFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: UnassignedToAllocateValues): ToUnassigned => ({
  arrival: toWaypoint(formValues.arrivalPlace),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toWaypoint(formValues.departurePlace),
  distance: kilometersToMeters(formValues.driveDistance),
  duration: minutesToSeconds(formValues.driveDuration),
  kind: toKind(formValues.isTwoWayDrive),
  nature: toNature(formValues.isMedicalDrive),
  passenger: toPassenger(formValues),
  status: 'to-unassigned'
});
