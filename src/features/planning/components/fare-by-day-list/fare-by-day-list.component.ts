import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareByDay } from '../../providers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fare-by-day-list',
  templateUrl: './fare-by-day-list.component.html'
})
export class FareByDayListComponent {
  @Input() public fares: FareByDay[] = [];

  public trackByFareId = (_: number, fare: FareByDay): string => fare.id;
}
