import { Entity, WithNature, Scheduled } from '@definitions';
import { BillingItem, BillingItemsByDriver } from '../definitions/billing.presentation';
import { isMedicalDrive, isTwoWayDrive } from '@features/fare';
import { groupBy as arrayGroupBy } from 'fp-ts/NonEmptyArray';
import { format } from 'date-fns';
import { sort } from 'fp-ts/Array';
import { contramap, Ord } from 'fp-ts/Ord';
import { Ord as ordDate } from 'fp-ts/Date';
import { toWaypointValues } from '../../common/waypoint';
import { toIdentity } from '../../common/regular';
import { metersToKilometers } from '../../common/presentation';

import * as XLSX from 'xlsx';

type WithDatetimeValues = { datetime: string };

export const sortByDatetime = <T extends WithDatetimeValues>(fares: T[]): T[] => sort(byDatetime)(fares);

const byDatetime: Ord<WithDatetimeValues> = contramap((fare: { datetime: string }): Date => new Date(fare.datetime))(ordDate);

// TODO Common time presenter
const toLocalTime = (datetime: string): string => format(new Date(datetime), "HH'h'mm");

export const toBillingItem = (fare: Entity & Scheduled): BillingItem => ({
  passenger: toIdentity(fare.passenger),
  contactPhone: fare.passenger.phone.number,
  datetime: fare.datetime,
  time: toLocalTime(fare.datetime),
  departure: toWaypointValues(fare.departure),
  arrival: toWaypointValues(fare.arrival),
  isMedicalDrive: isMedicalDrive(fare.nature),
  isTwoWayDrive: isTwoWayDrive(fare.kind),
  driver: fare.driver.username,
  distance: Math.max(metersToKilometers(fare.distance), 1)
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

/* eslint-disable */
export const generateExcelFromData = (rawData: BillingItemsByDriver): void => {
  const data = toExcelReadyData(rawData);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'export.xlsx');
};

const flattenBillingItem = (item: BillingItem): Record<string, any> => {
  const translatedItem = {
    driver: item.driver,
    passenger: item.passenger,
    departureWaypointName: item.departure.waypointName,
    arrivalWaypointName: item.arrival.waypointName,
    time: item.time,
    distance: item.distance,
    departurePlaceContext: item.departure.place.context,
    arrivalPlaceContext: item.arrival.place.context,
    isTwoWayDrive: item.isTwoWayDrive,
    contactPhone: item.contactPhone
  };

  // Convert keys using the translation mapping
  const translatedKeysItem: Record<string, any> = {};
  for (const key in translatedItem) {
    translatedKeysItem[columnTranslations[key as keyof typeof translatedItem] || key] =
      translatedItem[key as keyof typeof translatedItem];
  }
  return translatedKeysItem;
};

const toExcelReadyData = (billingItems: BillingItemsByDriver): any[] => {
  const allItems: any[] = [];

  Object.values(billingItems).forEach((itemsArray) => {
    itemsArray.forEach((item) => {
      allItems.push(flattenBillingItem(item));
    });
  });

  return allItems;
};

const columnTranslations: Record<string, string> = {
  driver: 'Chauffeur',
  passenger: 'Passager',
  departureWaypointName: 'Nom du point de départ',
  arrivalWaypointName: 'Nom du point d’arrivée',
  time: 'Heure',
  distance: 'Distance (Km)',
  departurePlaceContext: 'Lieu de départ',
  arrivalPlaceContext: 'Lieu d’arrivée',
  isTwoWayDrive: 'Aller-retour',
  contactPhone: 'Téléphone de contact'
};
/* eslint-enable */
