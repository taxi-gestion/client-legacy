import { DestinationValues } from './definitions/destination.definition';
import { placeEmptyValue } from '@features/common/place';
import { Destination } from '@definitions';

export const destinationEmptyValue: DestinationValues = {
  destinationName: '',
  isMedicalDrive: true,
  isTwoWayDrive: true,
  place: placeEmptyValue,
  comment: undefined
};

export const toDestinationValues = (destination: Destination): DestinationValues => ({
  destinationName: destination.name,
  place: destination.place,
  isMedicalDrive: destination.nature === 'medical',
  isTwoWayDrive: destination.kind === 'two-way',
  comment: destination.comment
});

export const toDestinationsValues = (destinations: Destination | Destination[] | undefined): DestinationValues[] => {
  if (destinations === undefined) return [];

  return 'name' in destinations ? [toDestinationValues(destinations)] : destinations.map(toDestinationValues);
};
