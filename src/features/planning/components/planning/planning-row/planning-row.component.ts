import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { scaleForMinutesRelativeToOneHour } from './planning-row.presenter';

export type PlanningSession = {
  startTimeInMinutes: number;
  duration: number;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-row',
  templateUrl: './planning-row.component.html'
})
export class PlanningRowComponent {
  @Input({ required: true }) public sessions: PlanningSession[] = [];

  @Input({ required: true }) public template!: TemplateRef<{ session: PlanningSession }>;

  public constructor(public readonly planning: PlanningComponent) {}

  public offsetForMinutes: (minutes: number, scale: number) => number = scaleForMinutesRelativeToOneHour;
}
