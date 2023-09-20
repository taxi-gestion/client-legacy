import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidPlace } from '@definitions';
import { PlaceValues } from '../definitions';
import { toPlace } from '../place.presenter';

export const selectedPlaceValidator =
  (selectedPlace: PlaceValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    isValidPlaceValues(selectedPlace) ? null : { invalidPlace: { value: selectedPlace } };

export const isValidPlaceValues = (place: PlaceValues | undefined): boolean =>
  place === undefined ? false : isValidPlace(toPlace(place));
