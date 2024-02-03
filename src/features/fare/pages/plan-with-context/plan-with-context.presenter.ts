import { scheduleFareFormCodec } from '../fare.form';
import { Driver, Entity, Pending, RegularHistory, Scheduled, ScheduleScheduled, ToScheduled, Unassigned } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { toDriver } from '@features/common/driver';
import { toIdentity } from '@features/regular';
import { throwDecodeError } from '@features/common/form-validation';
import {
  datetimeLocalToIso8601UTCString,
  kilometersToMeters,
  minutesToSeconds,
  toKind,
  toNature,
  toTime
} from '@features/common/presentation';

import { FareToScheduleValues, RecurringPresentation, toPassenger } from '@features/fare';
import { toWaypoint } from '@features/common/waypoint';
import { toRecurringFaresPresentation } from '../edit-recurring/edit-recurring.presenter';
import { partition } from 'fp-ts/Array';
import { format, isBefore, startOfDay } from 'date-fns';
import { Separated } from 'fp-ts/Separated';
import { sortByDatetime } from '../../../common/presentation/sort.presenter';

export type MixedFaresPresentation = {
  link: string;
  status: string;
  creator: string;
  datetime: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  driver: string | undefined;
  departure: string;
  arrival: string;
};
export type MixedFares = Entity & { driver: Driver | undefined } & (Pending | Scheduled | Unassigned);

export type RegularFaresContext = {
  recurring: RecurringPresentation[];
  forthcoming: MixedFaresPresentation[];
  past: MixedFaresPresentation[];
};

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
  status: 'to-scheduled',
  creator: 'manager'
});

type WithDatetime = { datetime: string };

const partitionByDate =
  (date: Date) =>
  <T extends WithDatetime>(fares: T[]): Separated<T[], T[]> =>
    fpipe(
      fares,
      partition((fare: T): boolean => isBefore(new Date(fare.datetime), startOfDay(date)))
    );

// Example Usage
export const toRegularFaresContext = (regularHistory: RegularHistory): RegularFaresContext => {
  const separated: Separated<MixedFares[], MixedFares[]> = partitionByDate(new Date())([
    ...regularHistory.subcontracted,
    ...regularHistory.scheduled,
    ...regularHistory.pending,
    ...regularHistory.unassigned
  ]) as Separated<MixedFares[], MixedFares[]>;

  return {
    recurring: toRecurringFaresPresentation(regularHistory.recurring),
    forthcoming: toMixedFaresPresentation(sortByDatetime(separated.left, true)),
    past: toMixedFaresPresentation(sortByDatetime(separated.right, true))
  };
};

const toMixedFaresPresentation = (fare: MixedFares[]): MixedFaresPresentation[] => fare.map(toMixedFarePresentation);
const toMixedFarePresentation = (fare: MixedFares & { driver: Driver | undefined }): MixedFaresPresentation => ({
  link: statusRouteLink[fare.status]?.(fare.datetime.substring(0, 10), fare.id) ?? '',
  status: statusTranslation[fare.status] ?? '',
  creator: fare.creator,
  datetime: format(new Date(fare.datetime), "dd/MM/yyyy - HH'h'mm"),
  isMedicalDrive: fare.nature === 'medical',
  isTwoWayDrive: fare.kind === 'two-way',
  driver: fare.driver?.username ?? undefined,
  departure: fare.departure.name,
  arrival: fare.arrival.name
});

const statusTranslation: Record<string, string> = {
  unassigned: 'A assigner',
  scheduled: 'Planifiée',
  pending: 'Retour en attente',
  subcontracted: 'Sous-traitée'
};

const statusRouteLink: Record<string, (date: string, id: string | undefined) => string> = {
  unassigned: (date: string, id: string | undefined): string => `/fare/unassigned/${date}/${id}`,
  scheduled: (date: string, id: string | undefined): string => `/fare/edit/${date}/${id}`,
  pending: (date: string, id: string | undefined): string => `/fare/pendings/${date}/${id}`,
  subcontracted: (date: string): string => `/fare/subcontracted/${date}`
};
