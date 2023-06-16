import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { PlanningComponent } from '../planning.component';

type Session = {
  startTime: number;
  duration: number;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-row',
  templateUrl: './planning-row.component.html'
})
export class PlanningRowComponent {
  @Input({ required: true }) public sessions: Session[] = [];

  @Input({ required: true }) public template!: TemplateRef<{ session: Session }>;

  public constructor(public readonly planning: PlanningComponent) {}
}
