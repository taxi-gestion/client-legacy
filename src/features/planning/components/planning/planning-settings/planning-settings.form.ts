import { FormControl, FormGroup, Validators } from '@angular/forms';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Hour = `${0 | 1}${Digit}` | `${2}${0 | 1 | 2 | 3}`;
type Interval = '15' | '30' | '60';

export type PlanningSettingsValues = {
  interval: Interval;
  startTime: Hour;
  endTime: Hour;
};

export const DEFAULT_INTERVAL: Interval = '30';
export const DEFAULT_START_TIME: Hour = '07';
export const DEFAULT_END_TIME: Hour = '21';

export const PLANNING_SETTINGS_FORM: FormGroup<Record<keyof PlanningSettingsValues, FormControl>> = new FormGroup<
  Record<keyof PlanningSettingsValues, FormControl>
>({
  interval: new FormControl<PlanningSettingsValues['interval']>(DEFAULT_INTERVAL, [Validators.required]),
  startTime: new FormControl<PlanningSettingsValues['startTime']>(DEFAULT_START_TIME, [Validators.required]),
  endTime: new FormControl<PlanningSettingsValues['endTime']>(DEFAULT_END_TIME, [Validators.required])
});

export const setPlanningSettingsErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? PLANNING_SETTINGS_FORM.setErrors(handledError.errors)
    : PLANNING_SETTINGS_FORM.get(handledError.field)?.setErrors(handledError.errors);
