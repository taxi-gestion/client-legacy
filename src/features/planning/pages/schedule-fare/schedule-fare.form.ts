import { FormGroup } from '@angular/forms';
import { Type } from 'io-ts';
import { FareFields, fareFormCodec, fareFormControls, FareValues } from '../../common/fares.presentation';

export type FareToScheduleValues = FareValues;

export const scheduleFareFormCodec: Type<FareToScheduleValues> = fareFormCodec;

export type ScheduleFareFields = FareFields;

export const SCHEDULE_FARE_FORM: FormGroup<ScheduleFareFields> = new FormGroup<ScheduleFareFields>({
  ...fareFormControls()
});

export const setScheduleFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_FARE_FORM.setErrors(handledError.errors)
    : SCHEDULE_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
