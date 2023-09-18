import { FormControl, FormGroup, Validators } from '@angular/forms';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { Driver, Place } from '@definitions';
import { PendingPresentation } from '../../common';
import { EstimateJourneyFields, estimateJourneyFormControls } from '../../components';
import { defaultDriverValue } from '../../common/driver.presenter';

export type SchedulePendingFields = EstimateJourneyFields & {
  pendingReturnId: FormControl<string>;
  departureDatetime: FormControl<string>;
  departurePlace: FormControl<Place>;
  arrivalPlace: FormControl<Place>;
  driveDuration: FormControl<number>;
  driveDistance: FormControl<number>;
  driver: FormControl<Driver>;
};

export const SCHEDULE_RETURN_FORM: FormGroup<Record<keyof Omit<PendingPresentation, 'passenger'>, FormControl>> = new FormGroup<
  Record<keyof Omit<PendingPresentation, 'passenger'>, FormControl>
>({
  pendingReturnId: new FormControl<PendingPresentation['pendingReturnId']>(''),
  departureDatetime: new FormControl<PendingPresentation['departureDatetime']>('', [Validators.required]),
  departurePlace: new FormControl<PendingPresentation['departurePlace']>(defaultPlaceValue, [Validators.required]),
  arrivalPlace: new FormControl<PendingPresentation['arrivalPlace']>(defaultPlaceValue, [Validators.required]),
  ...estimateJourneyFormControls(),
  driver: new FormControl<PendingPresentation['driver']>(defaultDriverValue, [Validators.required])
});

export const setSchedulePendingErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_RETURN_FORM.setErrors(handledError.errors)
    : SCHEDULE_RETURN_FORM.get(handledError.field)?.setErrors(handledError.errors);
