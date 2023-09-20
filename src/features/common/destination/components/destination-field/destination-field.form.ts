import { FormControl, Validators } from '@angular/forms';
import { DestinationValues } from '../../definitions/destination.definition';
import { destinationEmptyValue } from '../../destination.presenter';

export type DestinationField<T extends string> = {
  [K in T]: FormControl<DestinationValues>;
};

export const destinationFieldFormControl = <T extends string>(formControlName: T): DestinationField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormControl<DestinationValues>(destinationEmptyValue, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as DestinationField<T>);
