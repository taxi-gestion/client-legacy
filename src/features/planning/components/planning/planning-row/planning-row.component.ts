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

  @Input() public rowContext: unknown = null;

  @Input({ required: true }) public template!: TemplateRef<{ session: PlanningSession }>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() public onSlotClickAction: (timeInMinutes: number, context: unknown) => void = (): void => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() public onSessionClickAction: (session: unknown, context: unknown) => void = (): void => {};

  public constructor(public readonly planning: PlanningComponent) {}

  public offsetForMinutes: (minutes: number, scale: number) => number = scaleForMinutesRelativeToOneHour;

  public onPlanningSlotClicked(timeInMinutes: number, context: unknown): void {
    this.onSlotClickAction(timeInMinutes, context);
  }

  public onPlanningSessionClicked(session: unknown, context: unknown, clickEvent: Event): void {
    clickEvent.stopPropagation();
    this.onSessionClickAction(session, context);
  }
}
