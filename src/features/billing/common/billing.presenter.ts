import { Entity, Nature, Scheduled } from '@definitions';
import { BillingItem, BillingItemsByDriver } from '../definitions/billing.presentation';
import { isMedicalDrive, isTwoWayDrive } from '@features/common/fare';
import { toIdentity } from '@features/common/regular';
import { groupBy as arrayGroupBy } from 'fp-ts/NonEmptyArray';
import { format } from 'date-fns';

// TODO Common time presenter
const toLocalTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const toBillingItem = (fare: Entity & Scheduled): BillingItem => ({
  passenger: toIdentity(fare.passenger),
  time: toLocalTime(fare.datetime),
  departure: fare.departure.context,
  destination: fare.destination.context,
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  driver: fare.driver.username
});

const driver = (billingItem: BillingItem): string => billingItem.driver;
export const groupByDriver = (billingItems: BillingItem[]): Record<string, BillingItem[]> => arrayGroupBy(driver)(billingItems);

export type FaresByNature = Record<Nature['nature'], (Entity & Scheduled)[]>;

export const groupByNature = (fares: (Entity & Scheduled)[]): FaresByNature =>
  fares.reduce<FaresByNature>(
    (acc: FaresByNature, fare: Entity & Scheduled): FaresByNature => ({
      ...acc,
      [fare.nature]: [...acc[fare.nature], fare]
    }),
    { medical: [], standard: [] }
  );

export const sortByTime = (item1: BillingItem, item2: BillingItem): number => item1.time.localeCompare(item2.time);

// TODO Refactor
/* eslint-disable */
export const sortBillingItemsByDriverByTime = (billingItemsByDriver: BillingItemsByDriver): BillingItemsByDriver => {
  const sorted: BillingItemsByDriver = {};
  for (const driver in billingItemsByDriver) {
    if (billingItemsByDriver.hasOwnProperty(driver)) {
      sorted[driver] = [...billingItemsByDriver[driver]!].sort(sortByTime);
    }
  }
  return sorted;
};
/* eslint-enable */
