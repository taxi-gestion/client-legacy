import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from '../../../common/fares.presentation';
import { SessionContext } from '../../planning/planning-row/planning-row.component';
import { toContextualizedSession } from '../../planning/planning-row/planning-row.presenter';
import { toIdentity } from '@features/common/regular';
import { PassengerValues } from '@features/fare';

@Component({
  selector: 'app-fare-planning-session',
  templateUrl: './fare-planning-session.component.html'
})
export class FarePlanningSessionComponent {
  @Input({ required: true }) public fare!: ScheduledPresentation;

  @Input({ required: true }) public rowContext!: DailyDriverPlanning;

  @Output() public selectSession: EventEmitter<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
    new EventEmitter<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>>();

  public onPlanningSessionClicked(sessionContext: unknown, rowContext: unknown): void {
    this.selectSession.emit(
      toContextualizedSession(sessionContext as ScheduledPlanningSession, rowContext as DailyDriverPlanning)
    );
  }

  public passengerIdentity(passenger: PassengerValues): string {
    return toIdentity(passenger);
  }
}
