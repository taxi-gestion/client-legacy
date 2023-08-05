import { FormControl, FormGroup, Validators } from '@angular/forms';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString } from '../../common/unit-convertion';
import { Place } from '@domain';
import { FareToSchedulePresentation } from '../schedule-fare/schedule-fare.form';
import { ReturnToAffectPresentation } from '../../common/return-to-affect.presentation';

export type AffectReturnFields = {
  returnToAffectId: FormControl<string>;
  departureDatetime: FormControl<Date>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driveDuration: FormControl<number>;
  driveDistance: FormControl<number>;
  driver: FormControl<string>;
};

export const AFFECT_RETURN_FORM: FormGroup<Record<keyof ReturnToAffectPresentation, FormControl>> = new FormGroup<
  Record<keyof ReturnToAffectPresentation, FormControl>
>({
  returnToAffectId: new FormControl<ReturnToAffectPresentation['returnToAffectId']>(''),
  departureDatetime: new FormControl<ReturnToAffectPresentation['departureDatetime']>(
    formatDateToDatetimeLocalString(new Date()),
    [Validators.required]
  ),
  departurePlace: new FormControl<ReturnToAffectPresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<ReturnToAffectPresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  driveDuration: new FormControl<FareToSchedulePresentation['driveDuration']>(0, [Validators.required]),
  driveDistance: new FormControl<FareToSchedulePresentation['driveDistance']>(0, [Validators.required]),
  driver: new FormControl<ReturnToAffectPresentation['driver']>('', [Validators.required])
});

export const setAffectReturnErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? AFFECT_RETURN_FORM.setErrors(handledError.errors)
    : AFFECT_RETURN_FORM.get(handledError.field)?.setErrors(handledError.errors);
