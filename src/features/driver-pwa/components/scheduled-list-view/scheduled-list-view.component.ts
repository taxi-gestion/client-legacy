import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DriverScheduledFarePresentation } from '../../pages/driver-agenda/driver-agenda.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-scheduled-list-view',
  templateUrl: './scheduled-list-view.component.html'
})
export class ScheduledListViewComponent {
  @Input({ required: true }) public entries!: DriverScheduledFarePresentation[];

  public onFocus(entry: DriverScheduledFarePresentation): void {
    // eslint-disable-next-line no-console
    console.log(entry);
  }
}
