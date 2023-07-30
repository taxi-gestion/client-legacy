import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { PlacePresentation } from '@features/place';

export type DailyPlannings = {
  name: string;
  fares: DailyPlanning;
}[];

export type FareForDatePresentation = {
  client: string;
  creator: string;
  departure: PlacePresentation;
  destination: PlacePresentation;
  distance: string;
  planning: string;
  duration: number;
  kind: string;
  nature: string;
  phone: string;
  status: string;
  time: string;
};

export type FaresForDatePresentation = FareForDatePresentation[];

// Plannings, horizontal axis
export type FareForDatePlanningSession = FareForDatePresentation & PlanningSession;
export type DailyPlanning = FareForDatePlanningSession[];

// Agenda, vertical axis
export type DailyAgenda = FaresForDatePresentation;
