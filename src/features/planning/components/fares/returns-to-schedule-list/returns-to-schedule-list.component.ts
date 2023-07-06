import { Component, Input } from '@angular/core';
import { FaresToScheduleForDatePresentation } from '@features/planning/common/fares-to-schedule.presentation';

@Component({
  selector: 'app-returns-to-schedule-list',
  templateUrl: './returns-to-schedule-list.component.html'
})
export class ReturnsToScheduleListComponent {
  @Input({ required: true }) public returnFaresToSchedule!: FaresToScheduleForDatePresentation;
}
