import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareByDayPresentation } from '../../presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fare-by-day-list',
  templateUrl: './fare-by-day-list.component.html'
})
export class FareByDayListComponent {
  @Input() public fares: FareByDayPresentation[] = [];

  public trackByFareId = (_: number, fare: FareByDayPresentation): string => fare.id;
}
