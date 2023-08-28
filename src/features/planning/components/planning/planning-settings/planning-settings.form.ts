import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lessThanValidator, moreThanValidator } from './validators';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Hour = `${0 | 1}${Digit}` | `${2}${0 | 1 | 2 | 3}`;
type Interval = '15' | '30' | '60' | '120';

export type PlanningSettingsValues = {
  interval: Interval;
  startHour: Hour;
  endHour: Hour;
};

export const DEFAULT_INTERVAL: Interval = '60';
export const DEFAULT_START_HOUR: Hour = '07';
export const DEFAULT_END_HOUR: Hour = '21';

export const PLANNING_SETTINGS_FORM: FormGroup<Record<keyof PlanningSettingsValues, FormControl>> = new FormGroup<
  Record<keyof PlanningSettingsValues, FormControl>
>({
  interval: new FormControl<PlanningSettingsValues['interval']>(DEFAULT_INTERVAL, [Validators.required]),
  startHour: new FormControl<PlanningSettingsValues['startHour']>(DEFAULT_START_HOUR, [
    Validators.required,
    lessThanValidator('endHour')
  ]),
  endHour: new FormControl<PlanningSettingsValues['endHour']>(DEFAULT_END_HOUR, [
    Validators.required,
    moreThanValidator('startHour')
  ])
});
