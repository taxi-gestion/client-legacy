import { Entity, Scheduled, WithNature } from '@definitions';
import { BillingItem, BillingItemsByDriver, BillingItemsByPassenger } from '../definitions/billing.presentation';
import { isMedicalDrive, isTwoWayDrive } from '@features/fare';
import { groupBy as arrayGroupBy } from 'fp-ts/NonEmptyArray';
import { format } from 'date-fns';
import { toWaypointValues } from '../../common/waypoint';
import { toIdentity } from '@features/regular';
import { metersToKilometers } from '../../common/presentation';

import * as XLSX from 'xlsx';

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
const passenger = (billingItem: BillingItem): string => billingItem.passenger;
export const groupByDriver = (billingItems: BillingItem[]): Record<string, BillingItem[]> => arrayGroupBy(driver)(billingItems);
export const groupByPassenger = (billingItems: BillingItem[]): Record<string, BillingItem[]> =>
  arrayGroupBy(passenger)(billingItems);

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
export const generateExcelFromDataByDriver = (rawData: BillingItemsByDriver): void => {
  const data = toExcelByDriverReadyData(rawData);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'export.xlsx');
};

export const generateExcelFromDataByPassenger = (rawData: BillingItemsByPassenger): void => {
  const data = toExcelByPassengerReadyData(rawData);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'export.xlsx');
};

const flattenBillingItemForDriverFirst = (item: BillingItem): Record<string, any> => {
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

const flattenBillingItemForPassengerFirst = (item: BillingItem): Record<string, any> => {
  const translatedItem = {
    passenger: item.passenger,
    driver: item.driver,
    departureWaypointName: item.departure.waypointName,
    arrivalWaypointName: item.arrival.waypointName,
    departurePlaceContext: item.departure.place.context,
    arrivalPlaceContext: item.arrival.place.context,
    time: item.time,
    distance: item.distance,
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

const toExcelByDriverReadyData = (billingItems: BillingItemsByDriver): any[] => {
  const allItems: any[] = [];

  Object.values(billingItems).forEach((itemsArray) => {
    itemsArray.forEach((item) => {
      allItems.push(flattenBillingItemForDriverFirst(item));
    });
  });

  return allItems;
};

const toExcelByPassengerReadyData = (billingItems: BillingItemsByPassenger): any[] => {
  const allItems: any[] = [];

  Object.values(billingItems).forEach((itemsArray) => {
    itemsArray.forEach((item) => {
      allItems.push(flattenBillingItemForPassengerFirst(item));
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
