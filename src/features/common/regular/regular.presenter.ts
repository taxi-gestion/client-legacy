import { RegularValues } from './definitions/regular.definition';
import { Entity, Passenger, RegularDetails } from '@definitions';
import { toDestinationsValues } from '@features/common/destination';
import { toPhonesValues } from '@features/common/phone';
import { PassengerValues } from '@features/common/fare';

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

export const toRegularValues = (regular: Entity & RegularDetails): Entity & RegularValues => ({
  civility: regular.civility,
  commentary: regular.commentary,
  destinations: toDestinationsValues(regular.destinations),
  firstname: regular.firstname,
  id: regular.id,
  homeAddress: regular.home,
  lastname: regular.lastname,
  phones: toPhonesValues(regular.phones),
  subcontractedClient: regular.subcontractedClient
});

export const toIdentity = (passenger: PassengerValues | (Entity & Passenger) | (Entity & RegularDetails)): string =>
  `${passenger.civility} ${passenger.lastname} ${firstnameOrEmpty(passenger)}`.trim();
