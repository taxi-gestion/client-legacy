import { PlaceValues } from '@features/common/place';

export type DestinationValues = {
  destinationName: string;
  place: PlaceValues;
  isTwoWayDrive: boolean | undefined;
  isMedicalDrive: boolean | undefined;
  comment: string | undefined;
};
