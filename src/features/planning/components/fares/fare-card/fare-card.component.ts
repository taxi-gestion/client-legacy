import { Component, Input } from '@angular/core';
import { ScheduledPresentation } from '../../../common/fares.presentation';
import { Entity, Passenger } from '@definitions';
import { toIdentity } from '@features/common/regular';

@Component({
  selector: 'app-fare-card',
  templateUrl: './fare-card.component.html'
})
export class FareCardComponent {
  @Input({ required: true }) public fare!: ScheduledPresentation;

  // eslint-disable-next-line no-undef
  public passengerIdentity(passenger: Entity & Passenger): string {
    return toIdentity(passenger);
  }
}
