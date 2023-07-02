import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {
  DEFAULT_END_TIME,
  DEFAULT_INTERVAL,
  DEFAULT_START_TIME,
  PLANNING_SETTINGS_FORM,
  PlanningSettingsValues
} from './planning-settings.form';
import { FormControl, FormGroup } from '@angular/forms';

type PlanningSettingsFields = {
  interval: FormControl<PlanningSettingsValues['interval']>;
  startTime: FormControl<PlanningSettingsValues['startTime']>;
  endTime: FormControl<PlanningSettingsValues['endTime']>;
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
    this.planningSettingsChange.next({
      interval: +(this.planningSettingsForm.value.interval ?? DEFAULT_INTERVAL),
      start: +(this.planningSettingsForm.value.startTime ?? DEFAULT_START_TIME) * 60,
      end: +(this.planningSettingsForm.value.endTime ?? DEFAULT_END_TIME) * 60
    });
  }
}
