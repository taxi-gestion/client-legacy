import { Entity, WithNature, Scheduled } from '@definitions';
import { BillingItem } from '../definitions/billing.presentation';
import { isMedicalDrive, isTwoWayDrive } from '@features/fare';
import { toIdentity } from '@features/common/regular';
import { groupBy as arrayGroupBy } from 'fp-ts/NonEmptyArray';
import { format } from 'date-fns';
import { sort } from 'fp-ts/Array';
import { contramap, Ord } from 'fp-ts/Ord';
import { Ord as ordDate } from 'fp-ts/Date';

type WithDatetimeValues = { datetime: string };

export const sortByDatetime = <T extends WithDatetimeValues>(fares: T[]): T[] => sort(byDatetime)(fares);

const byDatetime: Ord<WithDatetimeValues> = contramap((fare: { datetime: string }): Date => new Date(fare.datetime))(ordDate);

// TODO Common time presenter
const toLocalTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const toBillingItem = (fare: Entity & Scheduled): BillingItem => ({
  passenger: toIdentity(fare.passenger),
  datetime: fare.datetime,
  time: toLocalTime(fare.datetime),
  departure: fare.departure.place.context,
  arrival: fare.arrival.place.context,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  driver: fare.driver.username
});

const driver = (billingItem: BillingItem): string => billingItem.driver;
export const groupByDriver = (billingItems: BillingItem[]): Record<string, BillingItem[]> => arrayGroupBy(driver)(billingItems);

export type FaresByNature = Record<WithNature['nature'], (Entity & Scheduled)[]>;

export const groupByNature = (fares: (Entity & Scheduled)[]): FaresByNature =>
  fares.reduce<FaresByNature>(
    (acc: FaresByNature, fare: Entity & Scheduled): FaresByNature => ({
      ...acc,
      [fare.nature]: [...acc[fare.nature], fare]
    }),
    { medical: [], standard: [] }
  );
