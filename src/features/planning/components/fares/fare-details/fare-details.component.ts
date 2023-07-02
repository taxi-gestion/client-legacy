import { Component, Input } from '@angular/core';
import { FareForDatePresentation } from '../../../common/fares.presentation';

@Component({
  selector: 'app-fare-details',
  templateUrl: './fare-details.component.html'
})
export class FareDetailsComponent {
  @Input({ required: true }) public fare!: FareForDatePresentation;
}
