import { Civility } from '@definitions';
import { array as ioArray, string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { civilityCodec } from '@codecs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhonesFields, phonesFormControls, phoneValuesCodec } from '@features/common/phone';
import {
  DestinationsArrayElementFields,
  DestinationsArrayField,
  destinationsArrayFormControl,
  destinationValuesCodec
} from '@features/common/destination';
import { PlaceField, placeFieldFormControl, placeValuesCodec } from '@features/common/place';
import { RegularValues } from '@features/common/regular';

export const DEFAULT_CIVILITY: Civility = 'Mr';

export const regularFormCodec: Type<RegularValues> = ioType({
  civility: civilityCodec,
  firstname: ioUnion([ioString, ioUndefined]),
  lastname: ioString,
  phones: ioUnion([ioArray(phoneValuesCodec), ioUndefined]),
  homeAddress: ioUnion([placeValuesCodec, ioUndefined]),
  destinations: ioUnion([ioArray(destinationValuesCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export type RegularFields = DestinationsArrayField<'destinations'> &
  PlaceField<'homeAddress'> & {
    civility: FormControl<RegularValues['civility']>;
    firstname: FormControl<RegularValues['firstname']>;
    lastname: FormControl<RegularValues['lastname']>;
    commentary: FormControl<RegularValues['commentary']>;
    subcontractedClient: FormControl<RegularValues['subcontractedClient']>;
  } & { destinations: FormArray<FormGroup<DestinationsArrayElementFields>> } & { phones: PhonesFields };

export const regularFormControls = (): RegularFields => ({
  civility: new FormControl<RegularValues['civility']>(DEFAULT_CIVILITY, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  firstname: new FormControl<RegularValues['firstname']>(undefined, { nonNullable: true, validators: [] }),
  lastname: new FormControl<RegularValues['lastname']>('', { nonNullable: true, validators: [Validators.required] }),
  ...phonesFormControls(),
  ...placeFieldFormControl('homeAddress'),
  ...destinationsArrayFormControl('destinations'),
  commentary: new FormControl<RegularValues['commentary']>(undefined, { nonNullable: true, validators: [] }),
  subcontractedClient: new FormControl<RegularValues['subcontractedClient']>(undefined, {
    nonNullable: true,
    validators: []
  })
});
