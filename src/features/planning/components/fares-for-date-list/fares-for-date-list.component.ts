import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareForDate, FaresForDate } from '../../providers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fares-for-date-list',
  templateUrl: './fares-for-date-list.component.html'
})
export class FaresForDateListComponent {
  @Input() public fares: FaresForDate = [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  public trackByFarePhone = (_: number, fare: FareForDate): string => fare.phone;
}
