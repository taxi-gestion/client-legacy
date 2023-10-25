import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RegularHistoryScheduledItem } from '../../common/regular.presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-regular-history-scheduled',
  templateUrl: './regular-history-scheduled.component.html'
})
export class RegularHistoryScheduledComponent {
  @Input({ required: true }) public entries!: RegularHistoryScheduledItem[];
}
