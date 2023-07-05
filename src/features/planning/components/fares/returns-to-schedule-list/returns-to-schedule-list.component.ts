import { Component, Input } from '@angular/core';
import { FaresForDatePresentation } from '../../../common/fares.presentation';

@Component({
  selector: 'app-returns-to-schedule-list',
  templateUrl: './returns-to-schedule-list.component.html'
})
export class ReturnsToScheduleListComponent {
  @Input({ required: true }) public returnFaresToSchedule!: FaresForDatePresentation;
}
