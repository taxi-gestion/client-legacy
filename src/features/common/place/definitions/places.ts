// eslint-disable-next-line @typescript-eslint/no-shadow
import { isValidLocation, Location } from './location';

export type Place = {
  context: string;
  label: string;
  location: Location;
};

export type PlacePresentation = {
  context: string;
  label: string;
  location: Location;
};

export type PlaceTransfer = Place;

export const toPlaces = (places: PlaceTransfer[]): Place[] => places.map(toPlace);

export const toPlace = (place: PlaceTransfer): Place => ({
  ...place
});

export const isValidPlace = (placeData: Place): placeData is Place => isValidLocation(placeData.location);
