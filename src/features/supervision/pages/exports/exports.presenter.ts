// eslint-disable-next-line @typescript-eslint/naming-convention
import * as XLSX from 'xlsx';
import { civilityTranslations, Entity, Phone, Regular, Waypoint } from '../../../../definitions';
import { pipe as fpipe } from 'fp-ts/lib/function';
import { filter, map } from 'fp-ts/lib/Array';

/* eslint-disable */
export const generateExcelFromData = (rawData: (Entity & Regular)[]): void => {
  const data = toExcelReadyData(rawData);

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'export.xlsx');
};

const toExcelReadyData = (regulars: (Entity & Regular)[]): any[] => regulars.map(flattenRegular);

const flattenRegular = (regular: Entity & Regular): Record<string, any> => {
  const translatedItem = {
    civility: civilityTranslations[regular.civility],
    lastname: regular.lastname,
    firstname: regular.firstname,
    address: extractDomiciles(regular.waypoints === undefined ? [] : regular.waypoints),
    phones: regular.phones?.map(toPhonesString).join(';'),
    emails: '',
    destinations: extractDestinations(regular.waypoints === undefined ? [] : regular.waypoints),
    comment: regular.comment
  };

  // Convert keys using the translation mapping
  const translatedKeysItem: Record<string, any> = {};
  for (const key in translatedItem) {
    translatedKeysItem[columnTranslations[key as keyof typeof translatedItem] || key] =
      translatedItem[key as keyof typeof translatedItem];
  }
  return translatedKeysItem;
};

const columnTranslations: Record<string, string> = {
  civility: 'Civilité',
  lastname: 'Nom',
  firstname: 'Prénom',
  address: 'Adresse',
  phones: 'Téléphones',
  emails: 'Emails',
  destinations: 'Destinations',
  comment: 'Commentaire'
};
/* eslint-enable */

const toPhonesString = (phone: Phone): string => `${phone.type}: ${phone.number}`;

const extractDomiciles = (waypoints: Waypoint[]): string =>
  fpipe(
    waypoints,
    filter((waypoint: Waypoint): boolean => waypoint.name.toLowerCase().includes('domicile')),
    map((domicile: Waypoint): string => `${domicile.name}: ${domicile.place.context}`),
    (domiciles: string[]): string => domiciles.join('; ')
  );

const extractDestinations = (waypoints: Waypoint[]): string =>
  fpipe(
    waypoints,
    filter((waypoint: Waypoint): boolean => !waypoint.name.toLowerCase().includes('domicile')),
    map(
      (destination: Waypoint): string =>
        `${destination.name} - ${destination.place.context} - ${
          destination.kind === 'two-way' ? 'Aller et Retour' : 'Aller simple'
        } - ${destination.nature === 'medical' ? 'Medical' : 'Payant'}`
    ),
    (destinations: string[]): string => destinations.join('; ')
  );
