/* eslint-disable @typescript-eslint/no-shadow */
import { isValidLocation, Location } from './location.definition';

export type Place = {
  context: string;
  label: string;
  location: Location;
};

export const isValidPlace = (placeData: Place): placeData is Place => isValidLocation(placeData.location);
