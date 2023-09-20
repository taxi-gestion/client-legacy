import { PlaceValues } from './definitions/place.definition';
import { Place } from '@definitions';

export const placeEmptyValue: PlaceValues = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};

export const toPlace = (placeValue: PlaceValues): Place => ({
  ...placeValue
});

export const toPlaceValuesOrUndefined = (place: Place | PlaceValues | undefined): PlaceValues | undefined =>
  place === undefined ? undefined : place;

export const toPlacesValues = (places: Place | Place[] | PlaceValues | PlaceValues[] | undefined): PlaceValues[] => {
  if (places === undefined) return [];

  return 'context' in places ? [places] : places;
};

export const toPlaceValues = (place: Place): PlaceValues => place;
