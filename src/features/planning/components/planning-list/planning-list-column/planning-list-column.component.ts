import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareListItem } from '../../../layouts/daily-planning-list/daily-planning-list.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-list-column',
  templateUrl: './planning-list-column.component.html'
})
export class PlanningListColumnComponent {
  @Input({ required: true }) public driver!: string;

  @Input({ required: true }) public fares!: FareListItem[];
}
