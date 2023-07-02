import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {
  DEFAULT_END_HOUR,
  DEFAULT_INTERVAL,
  DEFAULT_START_HOUR,
  PLANNING_SETTINGS_FORM,
  PlanningSettingsValues
} from './planning-settings.form';
import { FormControl, FormGroup } from '@angular/forms';

type PlanningSettingsFields = {
  interval: FormControl<PlanningSettingsValues['interval']>;
  startHour: FormControl<PlanningSettingsValues['startHour']>;
  endHour: FormControl<PlanningSettingsValues['endHour']>;
};

export type PlanningSettings = {
  interval: number;
  start: number;
  end: number;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-settings',
  templateUrl: './planning-settings.component.html'
})
export class PlanningSettingsComponent {
  @Output() public planningSettingsChange: EventEmitter<PlanningSettings> = new EventEmitter<PlanningSettings>();

  public readonly planningSettingsForm: FormGroup<PlanningSettingsFields> = PLANNING_SETTINGS_FORM;

  public onPlanningSettingsFormChange(): void {
    if (PLANNING_SETTINGS_FORM.invalid) return;
    this.planningSettingsChange.next({
      interval: +(this.planningSettingsForm.value.interval ?? DEFAULT_INTERVAL),
      start: +(this.planningSettingsForm.value.startHour ?? DEFAULT_START_HOUR) * 60,
      end: +(this.planningSettingsForm.value.endHour ?? DEFAULT_END_HOUR) * 60
    });
  }
}
