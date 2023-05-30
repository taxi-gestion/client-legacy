import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareByDayPresentation } from '../../presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-fare',
  templateUrl: './create-fare.component.html'
})
export class CreateFareComponent {
  @Input() public fares: FareByDayPresentation[] = [];

  public trackByFareId = (_: number, fare: FareByDayPresentation): string => fare.id;
}
