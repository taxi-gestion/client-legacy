import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidPlace, Place } from '@definitions';

export const selectedPlaceValidator =
  (selectedPlace: Place): ValidatorFn =>
  (): ValidationErrors | null =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,id-denylist
    isValidPlace(selectedPlace) ? null : { invalidPlace: { value: selectedPlace } };
