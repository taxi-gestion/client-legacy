import { ValidationFailedBeforeApiCallError } from '../errors';
import { Destination, Entity, RegularDetails } from '@definitions';
import { DestinationValues } from '../components';
import { RegularValues } from './regular.presentation';
import { toPhone } from '../../common/phone';

export const throwDecodeError = (codecName: string, rawFormValues: unknown) => (): never => {
  throw new ValidationFailedBeforeApiCallError(
    `${codecName} decode error with payload ${JSON.stringify(rawFormValues, null, 2)}`
  );
};

export const isEmptyOrWhitespace = (str: string): boolean => str === '' || str.trim() === '';

export const toRegularDetails = (formValues: RegularValues): RegularDetails => ({
  civility: formValues.civility,
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phones: formValues.phones?.map(toPhone),
  home: formValues.homeAddress,
  commentary:
    formValues.commentary === undefined || isEmptyOrWhitespace(formValues.commentary) ? undefined : formValues.commentary,
  destinations: formValues.destinations?.map(toDestination),
  subcontractedClient:
    formValues.subcontractedClient === undefined || isEmptyOrWhitespace(formValues.subcontractedClient)
      ? undefined
      : formValues.subcontractedClient
});

const toDestination = (destination: DestinationValues): Destination => ({
  name: destination.destinationName,
  place: destination.place,
  nature: destination.isMedicalDrive ? 'medical' : 'standard',
  kind: destination.isTwoWayDrive ? 'two-way' : 'one-way',
  comment: destination.comment
});

export const firstnameOrEmpty = (regular: { firstname: string | undefined }): string =>
  regular.firstname === undefined ? '' : `${regular.firstname} `;

export const passengerIdentity = (passenger: Entity & Pick<RegularDetails, 'civility' | 'firstname' | 'lastname'>): string =>
  `${passenger.civility} ${firstnameOrEmpty(passenger)}${passenger.lastname}`;

export const defaultPassengerValue: Entity & RegularDetails = {
  civility: 'Mr',
  commentary: undefined,
  destinations: undefined,
  firstname: undefined,
  home: undefined,
  id: '',
  lastname: '',
  phones: undefined,
  subcontractedClient: undefined
};
