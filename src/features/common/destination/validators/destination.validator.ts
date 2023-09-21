import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DestinationValues } from '../definitions/destination.definition';
import { isValidPlaceValues } from '@features/common/place';

export const selectedDestinationValidator =
  (selectedDestination: DestinationValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    isValidDestinationValues(selectedDestination) ? null : { invalidDestination: { value: selectedDestination } };

export const destinationValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
  isValidDestinationValues(control.value) ? null : { invalidDestination: { value: control.value } };

const isValidDestinationValues = (destination: DestinationValues | undefined): boolean =>
  destination === undefined ? false : isDestinationValue(destination);

const isDestinationValue = (destination: DestinationValues): boolean =>
  isValidPlaceValues(destination.place) && destination.destinationName !== '';
