import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PlaceField } from '@features/common/place';
import { DestinationValues } from '../../definitions';

export type DestinationsArrayField<T extends string> = {
  [K in T]: FormArray<FormGroup<DestinationsArrayElementFields>>;
};

export type DestinationsArrayElementFields = PlaceField<'place'> & {
  destinationName: FormControl<DestinationValues['destinationName'] | null>;
  isTwoWayDrive: FormControl<DestinationValues['isTwoWayDrive'] | null>;
  isMedicalDrive: FormControl<DestinationValues['isMedicalDrive'] | null>;
  comment: FormControl<DestinationValues['comment'] | null>;
};

export const destinationsArrayFormControl = <T extends string>(formControlName: T): DestinationsArrayField<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [formControlName]: new FormArray<FormGroup<DestinationsArrayElementFields>>([])
  } as DestinationsArrayField<T>);
