import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { Scheduled } from '@domain';

export type DailyDriverPlanning = {
  driver: string;
  fares: ScheduledPlanningSession[];
};

// Plannings, horizontal axis
export type ScheduledPresentation = Scheduled & { localTime: string };
export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;
