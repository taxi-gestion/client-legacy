import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Entity, Place } from '@domain';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { ESTIMATE_JOURNEY_FORM_CONTROLS, EstimateJourneyFields, EstimateJourneyValues } from '../../components';

export type FareToEditPresentation = Entity &
  EstimateJourneyValues & {
    passenger: string;
    phoneToCall: string;
    departureDatetime: string;
    departurePlace: Place;
    arrivalPlace: Place;
    driver: string;
    isTwoWayDrive: boolean;
    isMedicalDrive: boolean;
  };

export type EditFareFields = EstimateJourneyFields & {
  id: FormControl<string>;
  passenger: FormControl<string>;
  phoneToCall: FormControl<string>;
  departureDatetime: FormControl<string>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driver: FormControl<string>;
  isTwoWayDrive: FormControl<boolean>;
  isMedicalDrive: FormControl<boolean>;
};

export const EDIT_FARE_FORM: FormGroup<Record<keyof FareToEditPresentation, FormControl>> = new FormGroup<
  Record<keyof FareToEditPresentation, FormControl>
>({
  id: new FormControl<FareToEditPresentation['id']>('', [Validators.required]),
  passenger: new FormControl<FareToEditPresentation['passenger']>('', [Validators.required]),
  phoneToCall: new FormControl<FareToEditPresentation['phoneToCall']>('', [Validators.required]),
  departureDatetime: new FormControl<FareToEditPresentation['departureDatetime']>('', [Validators.required]),
  departurePlace: new FormControl<FareToEditPresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<FareToEditPresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  ...ESTIMATE_JOURNEY_FORM_CONTROLS,
  driver: new FormControl<FareToEditPresentation['driver']>('', [Validators.required]),
  isTwoWayDrive: new FormControl<FareToEditPresentation['isTwoWayDrive']>(true, [Validators.required]),
  isMedicalDrive: new FormControl<FareToEditPresentation['isMedicalDrive']>(true, [Validators.required])
});

export const setEditFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? EDIT_FARE_FORM.setErrors(handledError.errors)
    : EDIT_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
