import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { PlaceValues } from '../definitions';
import { isValidPlaceValues } from '../place.presenter';

export const selectedPlaceValidator =
  (selectedPlace: PlaceValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    isValidPlaceValues(selectedPlace) ? null : { invalidPlace: { value: selectedPlace } };
