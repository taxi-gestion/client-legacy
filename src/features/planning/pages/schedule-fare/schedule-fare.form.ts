import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from '@domain';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { ESTIMATE_JOURNEY_FORM_CONTROLS, EstimateJourneyFields, EstimateJourneyValues } from '../../components';

export type FareToSchedulePresentation = EstimateJourneyValues & {
  passenger: string;
  phoneToCall: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driver: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export type ScheduleFareFields = EstimateJourneyFields & {
  passenger: FormControl<string>;
  phoneToCall: FormControl<string>;
  departureDatetime: FormControl<string>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driver: FormControl<string>;
  isTwoWayDrive: FormControl<boolean>;
  isMedicalDrive: FormControl<boolean>;
};

export const SCHEDULE_FARE_FORM: FormGroup<Record<keyof FareToSchedulePresentation, FormControl>> = new FormGroup<
  Record<keyof FareToSchedulePresentation, FormControl>
>({
  passenger: new FormControl<FareToSchedulePresentation['passenger']>('', [Validators.required]),
  phoneToCall: new FormControl<FareToSchedulePresentation['phoneToCall']>('', [Validators.required]),
  departureDatetime: new FormControl<FareToSchedulePresentation['departureDatetime']>('', [Validators.required]),
  departurePlace: new FormControl<FareToSchedulePresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<FareToSchedulePresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  ...ESTIMATE_JOURNEY_FORM_CONTROLS,
  driver: new FormControl<FareToSchedulePresentation['driver']>('', [Validators.required]),
  isTwoWayDrive: new FormControl<FareToSchedulePresentation['isTwoWayDrive']>(true, [Validators.required]),
  isMedicalDrive: new FormControl<FareToSchedulePresentation['isMedicalDrive']>(true, [Validators.required])
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
