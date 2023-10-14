import { RegularValues } from './definitions/regular.definition';
import { Entity, Passenger, Regular } from '@definitions';
import { toPhonesValues } from '@features/common/phone';
import { PassengerValues } from '@features/fare';
import { toWaypointsValues } from '../waypoint';

export const regularEmptyValue: Entity & RegularValues = {
  civility: 'Mr',
  comment: undefined,
  waypoints: undefined,
  firstname: '',
  id: '',
  lastname: '',
  phones: undefined,
  subcontractedClient: undefined
};

export const firstnameOrEmpty = (regular: { firstname: string | undefined }): string =>
  regular.firstname === undefined ? '' : `${regular.firstname} `;

export const toRegularsValues = (
  regulars: (Entity & Regular)[] | (Entity & Regular) | undefined
): (Entity & RegularValues)[] => {
  if (regulars === undefined) return [];

  return 'id' in regulars ? [toRegularValues(regulars)] : regulars.map(toRegularValues);
};

export const toRegularValues = (regular: Entity & Regular): Entity & RegularValues => ({
  civility: regular.civility,
  comment: regular.comment,
  waypoints: toWaypointsValues(regular.waypoints),
  firstname: regular.firstname,
  id: regular.id,
  lastname: regular.lastname,
  phones: toPhonesValues(regular.phones),
  subcontractedClient: regular.subcontractedClient
});

export const toIdentity = (passenger: PassengerValues | (Entity & Passenger) | (Entity & Regular)): string =>
  `${passenger.civility} ${passenger.lastname} ${firstnameOrEmpty(passenger)}`.trim();
