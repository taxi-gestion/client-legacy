import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FareToSchedule } from '../../../providers';

export type ScheduleFareFields = {
  clientIdentity: FormControl<string>;
  clientPhone: FormControl<string>;
  date: FormControl<Date>;
  driveFrom: FormControl<string>;
  driveKind: FormControl<'one-way' | 'outward' | 'return'>;
  driveNature: FormControl<'medical' | 'standard'>;
  planning: FormControl<string>;
  driveTo: FormControl<string>;
  startTime: FormControl<string>;
  recurrence: FormControl<string>;
  recurrenceQuery: FormControl<string>;
  recurrenceExplanation: FormControl<string>;
};

export const SCHEDULE_FARE_FORM: FormGroup<Record<keyof FareToSchedule, FormControl>> = new FormGroup<
  Record<keyof FareToSchedule, FormControl>
>({
  clientIdentity: new FormControl<FareToSchedule['clientIdentity']>('', [Validators.required]),
  clientPhone: new FormControl<FareToSchedule['clientPhone']>('', [Validators.required]),
  date: new FormControl<FareToSchedule['date']>('', [Validators.required]),
  driveFrom: new FormControl<FareToSchedule['driveFrom']>('', [Validators.required]),
  driveKind: new FormControl<FareToSchedule['driveKind']>('outward', [Validators.required]),
  driveNature: new FormControl<FareToSchedule['driveNature']>('medical', [Validators.required]),
  planning: new FormControl<FareToSchedule['planning']>(''),
  driveTo: new FormControl<FareToSchedule['driveTo']>('', [Validators.required]),
  startTime: new FormControl<FareToSchedule['startTime']>('00:00', [Validators.required]),
  recurrence: new FormControl<FareToSchedule['recurrence']>('', [Validators.required]),
  recurrenceQuery: new FormControl<FareToSchedule['recurrenceQuery']>('', [Validators.required]),
  recurrenceExplanation: new FormControl<FareToSchedule['recurrenceExplanation']>('', [Validators.required])
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
