import { PlaceValues } from './definitions/place.definition';
import { Place } from '@definitions';
import { isRight } from 'fp-ts/Either';
import { placeRules } from '../../../codecs/domain-rules/place.rules';

export const emptyPlaceValue: PlaceValues = {
  context: '',
  label: ''
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

export const isValidPlaceValues = (place: PlaceValues | undefined): boolean => isRight(placeRules.decode(place));
