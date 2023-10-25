import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionContext } from '../../planning/planning-row/planning-row.component';
import { toContextualizedSession } from '../../planning/planning-row/planning-row.presenter';
import { toIdentity } from '@features/regular';
import { PassengerValues } from '@features/fare';
import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from '../../../common/agenda.presenter';

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
