import { RegularValues } from './definitions/regular.definition';
import { Entity, Passenger, RegularDetails } from '@definitions';
import { DestinationValues, toDestinationsValues } from '@features/common/destination';
import { toPhonesValues } from '@features/common/phone';
import { PassengerValues } from '@features/fare';
import { emptyPlaceValue, PlaceValues, toPlaceValues } from '@features/common/place';

export const regularEmptyValue: Entity & RegularValues = {
  civility: 'Mr',
  commentary: undefined,
  destinations: undefined,
  firstname: '',
  id: '',
  homeAddress: undefined,
  lastname: '',
  phones: undefined,
  subcontractedClient: undefined
};

export const firstnameOrEmpty = (regular: { firstname: string | undefined }): string =>
  regular.firstname === undefined ? '' : `${regular.firstname} `;

export const toRegularsValues = (
  regulars: (Entity & RegularDetails)[] | (Entity & RegularDetails) | undefined
): (Entity & RegularValues)[] => {
  if (regulars === undefined) return [];

  return 'id' in regulars ? [toRegularValues(regulars)] : regulars.map(toRegularValues);
};

const domicileAsDestination = (place: PlaceValues): DestinationValues => ({
  destinationName: 'Domicile',
  place,
  isMedicalDrive: undefined,
  isTwoWayDrive: undefined,
  comment: undefined
});

const destinationsWithDomicile = (destinations: DestinationValues[] | undefined, domicile: PlaceValues): DestinationValues[] =>
  destinations === undefined ? [domicileAsDestination(domicile)] : [...destinations, domicileAsDestination(domicile)];

export const toRegularValues = (regular: Entity & RegularDetails): Entity & RegularValues => ({
  civility: regular.civility,
  commentary: regular.commentary,
  destinations: destinationsWithDomicile(
    toDestinationsValues(regular.destinations),
    toPlaceValues(regular.home ?? emptyPlaceValue)
  ),
  firstname: regular.firstname,
  id: regular.id,
  homeAddress: regular.home,
  lastname: regular.lastname,
  phones: toPhonesValues(regular.phones),
  subcontractedClient: regular.subcontractedClient
});

export const toIdentity = (passenger: PassengerValues | (Entity & Passenger) | (Entity & RegularDetails)): string =>
  `${passenger.civility} ${passenger.lastname} ${firstnameOrEmpty(passenger)}`.trim();
