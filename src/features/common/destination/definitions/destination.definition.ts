import { PlaceValues } from '@features/common/place';

export type DestinationValues = {
  destinationName: string;
  place: PlaceValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  comment: string | undefined;
};
