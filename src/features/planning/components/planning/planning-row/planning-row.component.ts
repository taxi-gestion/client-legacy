import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { scaleForMinutesRelativeToOneHour, toContextualizedSession, toContextualizedSlot } from './planning-row.presenter';

export type PlanningSession = StartTime & {
  duration: number;
};

export type StartTime = {
  startTimeInMinutes: number;
};

export type SlotContext<RowContext> = StartTime & {
  rowContext: RowContext;
};

export type SessionContext<Session, Row> = PlanningSession & {
  rowContext: Row;
  sessionContext: Session;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-row',
  templateUrl: './planning-row.component.html'
})
export class PlanningRowComponent<Row, Session extends PlanningSession> {
  @Input({ required: true }) public sessions: Session[] = [];

  @Input() public rowContext: unknown = null;

  @Output() public readonly selectSlot: EventEmitter<SlotContext<Row>> = new EventEmitter<SlotContext<Row>>();

  @Output() public readonly selectSession: EventEmitter<SessionContext<Session, Row>> = new EventEmitter<
    SessionContext<Session, Row>
  >();

  @Input({ required: true }) public template!: TemplateRef<{ session: Session }>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() public onSlotClickAction: (timeInMinutes: number, context: unknown) => void = (): void => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() public onSessionClickAction: (session: unknown, context: unknown) => void = (): void => {};

  public constructor(public readonly planning: PlanningComponent) {}

  public offsetForMinutes: (minutes: number, scale: number) => number = scaleForMinutesRelativeToOneHour;

  public onPlanningSlotClicked(startTimeInMinutes: number, rowContext: unknown): void {
    this.selectSlot.emit(toContextualizedSlot(rowContext as Row, { startTimeInMinutes }));
  }

  public onPlanningSessionClicked(sessionContext: unknown, rowContext: unknown, clickEvent: Event): void {
    clickEvent.stopPropagation();
    this.selectSession.emit(toContextualizedSession(sessionContext as Session, rowContext as Row));
  }
}
