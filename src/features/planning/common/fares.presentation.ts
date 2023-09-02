import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { Driver, Entity, Scheduled } from '@definitions';

export type DailyDriverPlanning = {
  driver: Driver & Entity;
  fares: ScheduledPlanningSession[];
};

// Plannings, horizontal axis
export type ScheduledPresentation = Entity & Scheduled & { localTime: string };
export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;
