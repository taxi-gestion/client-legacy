import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-recurrence.layout.html'
})
export class ManageRecurrenceLayout {}
