import { Civility, Place } from '@definitions';
import { DestinationsFields, destinationsFormControls, DestinationValues, destinationValuesCodec } from '../components';
import { PhonesFields, phonesFormControls, PhoneValues, phoneValuesCodec } from '../components/regular/phones/phones.component';
import { array as ioArray, string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { civilityCodec, placeCodec } from '@codecs';
import { FormControl, Validators } from '@angular/forms';
import { RegisterRegularValues } from '../pages/register-regular/register-regular.form';

export const DEFAULT_CIVILITY: Civility = 'Mr';

export type RegularValues = {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  homeAddress: Place | undefined;
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
  homeAddress: ioUnion([placeCodec, ioUndefined]),
  destinations: ioUnion([ioArray(destinationValuesCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export type RegularFields = {
  civility: FormControl<RegularValues['civility']>;
  firstname: FormControl<RegularValues['firstname']>;
  lastname: FormControl<RegularValues['lastname']>;
  homeAddress: FormControl<RegularValues['homeAddress']>;
  commentary: FormControl<RegularValues['commentary']>;
  subcontractedClient: FormControl<RegularValues['subcontractedClient']>;
} & { destinations: DestinationsFields } & { phones: PhonesFields };

export const regularFormControls = (): RegularFields => ({
  civility: new FormControl<RegisterRegularValues['civility']>(DEFAULT_CIVILITY, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  firstname: new FormControl<RegisterRegularValues['firstname']>(undefined, { nonNullable: true, validators: [] }),
  lastname: new FormControl<RegisterRegularValues['lastname']>('', { nonNullable: true, validators: [Validators.required] }),
  ...phonesFormControls(),
  homeAddress: new FormControl<RegisterRegularValues['homeAddress']>(undefined, { nonNullable: true, validators: [] }),
  ...destinationsFormControls(),
  commentary: new FormControl<RegisterRegularValues['commentary']>(undefined, { nonNullable: true, validators: [] }),
  subcontractedClient: new FormControl<RegisterRegularValues['subcontractedClient']>(undefined, {
    nonNullable: true,
    validators: []
  })
});
