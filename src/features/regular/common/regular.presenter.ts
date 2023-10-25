import { Civility, Entity, Passenger, Regular } from '@definitions';
import { toPhone, toPhonesValues } from '@features/common/phone';
import { RegularValues } from '@features/regular';
import { toWaypoint, toWaypointsValues } from '@features/common/waypoint';
import { ValidationFailedBeforeApiCallError } from '@features/common/form-validation';
import { PassengerValues } from '../../fare';

export const throwDecodeError = (codecName: string, rawFormValues: unknown) => (): never => {
  throw new ValidationFailedBeforeApiCallError(
    `${codecName} decode error with payload ${JSON.stringify(rawFormValues, null, 2)}`
  );
};

export const isEmptyOrWhitespace = (str: string): boolean => str === '' || str.trim() === '';

export const toRegular = (formValues: RegularValues): Regular => ({
  civility: formValues.civility,
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phones: formValues.phones?.map(toPhone),
  comment: formValues.comment === undefined || isEmptyOrWhitespace(formValues.comment) ? undefined : formValues.comment,
  waypoints: formValues.waypoints?.map(toWaypoint),
  subcontractedClient:
    formValues.subcontractedClient === undefined || isEmptyOrWhitespace(formValues.subcontractedClient)
      ? undefined
      : formValues.subcontractedClient
});

export const firstnameOrEmpty = (regular: { firstname: string | undefined }): string =>
  regular.firstname === undefined ? '' : `${regular.firstname} `;

export const passengerIdentity = (passenger: { civility: Civility; firstname: string | undefined; lastname: string }): string =>
  `${passenger.civility} ${firstnameOrEmpty(passenger)}${passenger.lastname}`;
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
