import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Civility, Place } from '@definitions';
import {
  PHONES_FORM_CONTROLS,
  PhonesFields,
  PhoneValues,
  phoneValuesCodec
} from '../../components/regular/phones/phones.component';
import {
  DESTINATIONS_FORM_CONTROLS,
  DestinationsFields,
  DestinationValues,
  destinationValuesCodec
} from '../../components/regular/destinations/destinations.component';
import { Type, type as ioType, string as ioString, union as ioUnion, undefined as ioUndefined, array as ioArray } from 'io-ts';
import { civilityCodec, placeCodec } from '@codecs';

export type EditRegularValues = {
  destinations: DestinationValues[] | undefined;
} & {
  phones: PhoneValues[] | undefined;
} & {
  regularId: string;
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  homeAddress: Place | undefined;
  commentary: string | undefined;
  subcontractedClient: string | undefined;
};

export const editRegularFormCodec: Type<EditRegularValues> = ioType({
  regularId: ioString,
  civility: civilityCodec,
  firstname: ioUnion([ioString, ioUndefined]),
  lastname: ioString,
  phones: ioUnion([ioArray(phoneValuesCodec), ioUndefined]),
  homeAddress: ioUnion([placeCodec, ioUndefined]),
  destinations: ioUnion([ioArray(destinationValuesCodec), ioUndefined]),
  commentary: ioUnion([ioString, ioUndefined]),
  subcontractedClient: ioUnion([ioString, ioUndefined])
});

export type EditRegularFields = {
  regularId: FormControl<EditRegularValues['regularId']>;
  civility: FormControl<EditRegularValues['civility']>;
  firstname: FormControl<EditRegularValues['firstname']>;
  lastname: FormControl<EditRegularValues['lastname']>;
  homeAddress: FormControl<EditRegularValues['homeAddress']>;
  commentary: FormControl<EditRegularValues['commentary']>;
  subcontractedClient: FormControl<EditRegularValues['subcontractedClient']>;
} & { destinations: DestinationsFields } & { phones: PhonesFields };

export const DEFAULT_CIVILITY: Civility = 'Mr';

export const EDIT_REGULAR_FORM: FormGroup<EditRegularFields> = new FormGroup<EditRegularFields>({
  regularId: new FormControl<EditRegularValues['regularId']>('', { nonNullable: true, validators: [Validators.required] }),
  civility: new FormControl<EditRegularValues['civility']>(DEFAULT_CIVILITY, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  firstname: new FormControl<EditRegularValues['firstname']>(undefined, { nonNullable: true, validators: [] }),
  lastname: new FormControl<EditRegularValues['lastname']>('', { nonNullable: true, validators: [Validators.required] }),
  ...PHONES_FORM_CONTROLS,
  homeAddress: new FormControl<EditRegularValues['homeAddress']>(undefined, { nonNullable: true, validators: [] }),
  ...DESTINATIONS_FORM_CONTROLS,
  commentary: new FormControl<EditRegularValues['commentary']>(undefined, { nonNullable: true, validators: [] }),
  subcontractedClient: new FormControl<EditRegularValues['subcontractedClient']>(undefined, {
    nonNullable: true,
    validators: []
  })
});

export const setEditRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_REGULAR_FORM.setErrors(handledError.errors)
    : EDIT_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
