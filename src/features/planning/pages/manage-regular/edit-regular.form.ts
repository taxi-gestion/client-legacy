import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Civility, Place } from '@definitions';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { PHONES_FORM_CONTROLS, PhoneValues, PhonesFields } from '../../components/regular/phones/phones.component';
import {
  DESTINATIONS_FORM_CONTROLS,
  DestinationsFields,
  DestinationValues
} from '../../components/regular/destinations/destinations.component';

export type EditRegularPresentation = {
  regularId: string;
  civility: Civility;
  firstname: string | undefined;
  lastname: string;
  homeAddress: Place;
  commentary: string;
  subcontractedClient: string;
} & { destinations: DestinationValues[] } & { phones: PhoneValues[] };

export type EditRegularFields = {
  regularId: FormControl<string | null>;
  civility: FormControl<Civility | null>;
  firstname: FormControl<string | null | undefined>;
  lastname: FormControl<string | null>;
  homeAddress: FormControl<Place | null>;
  commentary: FormControl<string | null>;
  subcontractedClient: FormControl<string | null>;
} & { destinations: DestinationsFields } & { phones: PhonesFields };

export const DEFAULT_CIVILITY: Civility = 'Mr';

export const EDIT_REGULAR_FORM: FormGroup<EditRegularFields> = new FormGroup<EditRegularFields>({
  regularId: new FormControl<EditRegularPresentation['regularId']>('', [Validators.required]),
  civility: new FormControl<EditRegularPresentation['civility']>(DEFAULT_CIVILITY, [Validators.required]),
  firstname: new FormControl<EditRegularPresentation['firstname']>('', [Validators.required]),
  lastname: new FormControl<EditRegularPresentation['lastname']>('', [Validators.required]),
  ...PHONES_FORM_CONTROLS,
  homeAddress: new FormControl<EditRegularPresentation['homeAddress']>(defaultPlaceValue, []),
  ...DESTINATIONS_FORM_CONTROLS,
  commentary: new FormControl<EditRegularPresentation['commentary']>('', []),
  subcontractedClient: new FormControl<EditRegularPresentation['subcontractedClient']>('', [])
});

export const setEditRegularErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_REGULAR_FORM.setErrors(handledError.errors)
    : EDIT_REGULAR_FORM.get(handledError.field)?.setErrors(handledError.errors);
