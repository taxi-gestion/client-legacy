import { Component, Input } from '@angular/core';
import { FareDriverCardPresentation } from '../../../common/agenda.presenter';

@Component({
  selector: 'app-fare-card',
  templateUrl: './fare-card.component.html'
})
export class FareCardComponent {
  @Input({ required: true }) public fare!: FareDriverCardPresentation;
}
