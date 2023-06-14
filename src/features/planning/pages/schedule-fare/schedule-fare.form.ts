import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FareToSchedule } from '../../providers';

export type ScheduleFareFields = {
  clientIdentity: FormControl<string>;
  clientPhone: FormControl<string>;
  date: FormControl<Date>;
  driveFrom: FormControl<string>;
  driveKind: FormControl<'one-way' | 'outward' | 'return'>;
  driveNature: FormControl<'medical' | 'standard'>;
  driverIdentity: FormControl<string>;
  driveTo: FormControl<string>;
  startTime: FormControl<string>;
};

export const SCHEDULE_FARE_FORM: FormGroup<Record<keyof FareToSchedule, FormControl>> = new FormGroup<
  Record<keyof FareToSchedule, FormControl>
>({
  clientIdentity: new FormControl<FareToSchedule['clientIdentity']>('Bob', [Validators.required]),
  clientPhone: new FormControl<FareToSchedule['clientPhone']>('+33684319514', [Validators.required]),
  date: new FormControl<FareToSchedule['date']>(new Date(), [Validators.required]),
  driveFrom: new FormControl<FareToSchedule['driveFrom']>('18 Avenue des Canuts, 69120', [Validators.required]),
  driveKind: new FormControl<FareToSchedule['driveKind']>('outward', [Validators.required]),
  driveNature: new FormControl<FareToSchedule['driveNature']>('medical', [Validators.required]),
  driverIdentity: new FormControl<FareToSchedule['driverIdentity']>('David Huan'),
  driveTo: new FormControl<FareToSchedule['driveTo']>('17 Avenue du général de Gaule 69001', [Validators.required]),
  startTime: new FormControl<FareToSchedule['startTime']>('16:00', [Validators.required])
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
