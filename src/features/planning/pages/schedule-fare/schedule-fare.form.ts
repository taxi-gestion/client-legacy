import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from '@features/common/place';
import { FareToSchedule } from '@features/planning';
import { PredictedRecurrence } from '@features/common/recurrence';
import { defaultPlaceValue } from '../../common/fares.presenter';

export type ScheduleFareFields = {
  clientIdentity: FormControl<string>;
  clientPhone: FormControl<string>;
  datetime: FormControl<Date>;
  driveFrom: FormControl<Place>;
  driveKind: FormControl<'one-way' | 'outward' | 'return'>;
  driveNature: FormControl<'medical' | 'standard'>;
  planning: FormControl<string>;
  driveTo: FormControl<Place>;
  recurrence: FormControl<PredictedRecurrence>;
  duration: FormControl<number>;
  distance: FormControl<number>;
};

export const SCHEDULE_FARE_FORM: FormGroup<Record<keyof FareToSchedule, FormControl>> = new FormGroup<
  Record<keyof FareToSchedule, FormControl>
>({
  clientIdentity: new FormControl<FareToSchedule['clientIdentity']>('', [Validators.required]),
  clientPhone: new FormControl<FareToSchedule['clientPhone']>('', [Validators.required]),
  datetime: new FormControl<FareToSchedule['datetime']>('', [Validators.required]),
  driveFrom: new FormControl<FareToSchedule['driveFrom']>(defaultPlaceValue, [Validators.required]),
  driveKind: new FormControl<FareToSchedule['driveKind']>('outward', [Validators.required]),
  driveNature: new FormControl<FareToSchedule['driveNature']>('medical', [Validators.required]),
  planning: new FormControl<FareToSchedule['planning']>(''),
  driveTo: new FormControl<FareToSchedule['driveTo']>(defaultPlaceValue, [Validators.required]),
  recurrence: new FormControl<FareToSchedule['recurrence']>(undefined),
  duration: new FormControl<FareToSchedule['duration']>(0, [Validators.required]),
  distance: new FormControl<FareToSchedule['distance']>(0, [Validators.required])
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
