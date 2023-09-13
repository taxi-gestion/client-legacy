import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Civility, Place } from '@definitions';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { PhonesFields, phonesFormControls, PhoneValues } from '../../components/regular/phones/phones.component';
import {
  DestinationsFields,
  destinationsFormControls,
  DestinationValues
} from '../../components/regular/destinations/destinations.component';

export type RegisterRegularPresentation = {
  civility: Civility;
  firstname: string | undefined;
  lastname: string;
  homeAddress: Place;
  commentary: string;
  subcontractedClient: string;
} & { destinations: DestinationValues[] } & { phones: PhoneValues[] };

export type RegisterRegularFields = {
  civility: FormControl<Civility | null>;
  firstname: FormControl<string | null | undefined>;
  lastname: FormControl<string | null>;
  homeAddress: FormControl<Place | null>;
  commentary: FormControl<string | null>;
  subcontractedClient: FormControl<string | null>;
} & { destinations: DestinationsFields } & { phones: PhonesFields };

export const DEFAULT_CIVILITY: Civility = 'Mr';

export const REGISTER_REGULAR_FORM: FormGroup<RegisterRegularFields> = new FormGroup<RegisterRegularFields>({
  civility: new FormControl<RegisterRegularPresentation['civility']>(DEFAULT_CIVILITY, [Validators.required]),
  firstname: new FormControl<RegisterRegularPresentation['firstname']>('', []),
  lastname: new FormControl<RegisterRegularPresentation['lastname']>('', [Validators.required]),
  ...phonesFormControls(),
  homeAddress: new FormControl<RegisterRegularPresentation['homeAddress']>(defaultPlaceValue, []),
  ...destinationsFormControls(),
  commentary: new FormControl<RegisterRegularPresentation['commentary']>('', []),
  subcontractedClient: new FormControl<RegisterRegularPresentation['subcontractedClient']>('', [])
});

export const setRegisterRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? REGISTER_REGULAR_FORM.setErrors(handledError.errors)
    : REGISTER_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
