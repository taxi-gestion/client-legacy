import { PlanningSession, SessionContext, SlotContext, StartTime } from './planning-row.component';

const MINUTES_IN_ONE_HOUR: 60 = 60 as const;

export const scaleForMinutesRelativeToOneHour = (minutes: number, scale: number): number =>
  scale / (MINUTES_IN_ONE_HOUR / minutes);

export const toContextualizedSlot = <Row>(rowContext: Row, slot: StartTime): SlotContext<Row> => ({
  rowContext: { ...rowContext },
  ...slot
});

export const toContextualizedSession = <Session extends PlanningSession, Row>(
  sessionContext: Session,
  rowContext: Row
): SessionContext<Session, Row> => ({
  startTimeInMinutes: sessionContext.startTimeInMinutes,
  duration: sessionContext.duration,
  rowContext: { ...rowContext },
  sessionContext: { ...sessionContext }
});
