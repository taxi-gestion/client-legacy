import { Component, Input } from '@angular/core';
import { FareForDatePresentation } from '../../../common/fares.presentation';

@Component({
  selector: 'app-fare-planning-session',
  templateUrl: './fare-planning-session.component.html',
  styleUrls: ['./fare-planning-session.component.scss']
})
export class FarePlanningSessionComponent {
  @Input({ required: true }) public fare!: FareForDatePresentation;
}
