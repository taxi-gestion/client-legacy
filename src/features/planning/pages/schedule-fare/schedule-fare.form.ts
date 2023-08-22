import { FormControl, FormGroup, Validators } from '@angular/forms';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { Place } from '@domain';

export type FareToSchedulePresentation = {
  passenger: string;
  phoneToCall: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driveDuration: number;
  driveDistance: number;
  driver: string;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;

  //repetition: PredictedRecurrence | undefined;
};

export type ScheduleFareFields = {
  passenger: FormControl<string>;
  phoneToCall: FormControl<string>;
  departureDatetime: FormControl<string>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driveDuration: FormControl<number>;
  driveDistance: FormControl<number>;
  driver: FormControl<string>;
  isTwoWayDrive: FormControl<boolean>;
  isMedicalDrive: FormControl<boolean>;

  //repetition: FormControl<PredictedRecurrence>;
};

export const SCHEDULE_FARE_FORM: FormGroup<Record<keyof FareToSchedulePresentation, FormControl>> = new FormGroup<
  Record<keyof FareToSchedulePresentation, FormControl>
>({
  passenger: new FormControl<FareToSchedulePresentation['passenger']>('', [Validators.required]),
  phoneToCall: new FormControl<FareToSchedulePresentation['phoneToCall']>('', [Validators.required]),
  departureDatetime: new FormControl<FareToSchedulePresentation['departureDatetime']>('', [Validators.required]),
  departurePlace: new FormControl<FareToSchedulePresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<FareToSchedulePresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  driveDuration: new FormControl<FareToSchedulePresentation['driveDuration']>(0, [Validators.required]),
  driveDistance: new FormControl<FareToSchedulePresentation['driveDistance']>(0, [Validators.required]),
  driver: new FormControl<FareToSchedulePresentation['driver']>('', [Validators.required]),
  isTwoWayDrive: new FormControl<FareToSchedulePresentation['isTwoWayDrive']>(true, [Validators.required]),
  isMedicalDrive: new FormControl<FareToSchedulePresentation['isMedicalDrive']>(true, [Validators.required])
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
