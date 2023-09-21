import { Civility } from '@definitions';
import { array as ioArray, string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { civilityCodec } from '@codecs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterRegularValues } from '../pages/register-regular/register-regular.form';
import { PhonesFields, phonesFormControls, PhoneValues, phoneValuesCodec } from '@features/common/phone';
import {
  DestinationsArrayElementFields,
  DestinationsArrayField,
  destinationsArrayFormControl,
  DestinationValues,
  destinationValuesCodec
} from '@features/common/destination';
import { PlaceField, placeFieldFormControl, PlaceValues } from '@features/common/place';
import { placeValuesCodec } from '../../common/place/codecs';

export const DEFAULT_CIVILITY: Civility = 'Mr';

export type RegularValues = {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  homeAddress: PlaceValues | undefined;
  commentary: string | undefined;
  subcontractedClient: string | undefined;
} & {
  destinations: DestinationValues[] | undefined;
} & {
  phones: PhoneValues[] | undefined;
};

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
  civility: new FormControl<RegisterRegularValues['civility']>(DEFAULT_CIVILITY, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  firstname: new FormControl<RegisterRegularValues['firstname']>(undefined, { nonNullable: true, validators: [] }),
  lastname: new FormControl<RegisterRegularValues['lastname']>('', { nonNullable: true, validators: [Validators.required] }),
  ...phonesFormControls(),
  ...placeFieldFormControl('homeAddress'),
  ...destinationsArrayFormControl('destinations'),
  commentary: new FormControl<RegisterRegularValues['commentary']>(undefined, { nonNullable: true, validators: [] }),
  subcontractedClient: new FormControl<RegisterRegularValues['subcontractedClient']>(undefined, {
    nonNullable: true,
    validators: []
  })
});
