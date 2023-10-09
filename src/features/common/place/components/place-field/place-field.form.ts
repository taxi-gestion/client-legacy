import { FormControl, Validators } from '@angular/forms';
import { PlaceValues } from '../../definitions/place.definition';
import { emptyPlaceValue } from '../../place.presenter';

export type PlaceField<T extends string> = {
  [K in T]: FormControl<PlaceValues>;
};

export const placeFieldFormControl = <T extends string>(formControlName: T, value?: PlaceValues | undefined): PlaceField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<PlaceValues>(value === undefined ? emptyPlaceValue : value, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as PlaceField<T>);
