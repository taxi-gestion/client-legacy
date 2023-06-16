import { Component, Input } from '@angular/core';
import { FareForDate } from '../../../providers';

@Component({
  selector: 'app-fare-details',
  templateUrl: './fare-details.component.html',
  styleUrls: ['./fare-details.component.css']
})
export class FareDetailsComponent {
  @Input({ required: true }) public fare!: FareForDate;
}
