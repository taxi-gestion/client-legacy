import { FormControl, FormGroup, Validators } from '@angular/forms';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString } from '../../common/unit-convertion';
import { Place } from '@domain';
import { FareToSchedulePresentation } from '../schedule-fare/schedule-fare.form';
import { PendingPresentation } from '../../common';

export type ScheduleReturnFields = {
  pendingReturnId: FormControl<string>;
  departureDatetime: FormControl<Date>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driveDuration: FormControl<number>;
  driveDistance: FormControl<number>;
  driver: FormControl<string>;
};

export const SCHEDULE_RETURN_FORM: FormGroup<Record<keyof Omit<PendingPresentation, 'passenger'>, FormControl>> = new FormGroup<
  Record<keyof Omit<PendingPresentation, 'passenger'>, FormControl>
>({
  pendingReturnId: new FormControl<PendingPresentation['pendingReturnId']>(''),
  departureDatetime: new FormControl<PendingPresentation['departureDatetime']>(formatDateToDatetimeLocalString(new Date()), [
    Validators.required
  ]),
  departurePlace: new FormControl<PendingPresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<PendingPresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  driveDuration: new FormControl<FareToSchedulePresentation['driveDuration']>(0, [Validators.required]),
  driveDistance: new FormControl<FareToSchedulePresentation['driveDistance']>(0, [Validators.required]),
  driver: new FormControl<PendingPresentation['driver']>('', [Validators.required])
});

export const setScheduleReturnErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_RETURN_FORM.setErrors(handledError.errors)
    : SCHEDULE_RETURN_FORM.get(handledError.field)?.setErrors(handledError.errors);
