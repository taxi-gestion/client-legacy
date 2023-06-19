import { format } from 'date-fns';
import {
  FareForDatePlanningSession,
  FareForDatePresentation,
  DailyPlanning,
  FaresForDatePresentation,
  DailyPlannings
} from './fares.presentation';
import { FareForDate, FaresForDate } from '../providers';

export const formatDateDDMMYYYY = (date: Date): string => format(date, 'dd/MM/yyyy');

export const groupByPlanning = (faresList: DailyPlanning): DailyPlannings => {
  const groupedFares: Record<string, DailyPlanning> = faresList.reduce(
    (grouped: Record<string, DailyPlanning>, fare: FareForDatePlanningSession): Record<string, DailyPlanning> => {
      const groups: Record<string, DailyPlanning> = grouped;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const key: string = fare.planning;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (groups[key] == null) groups[key] = [];
      groups[key]?.push(fare);
      return groups;
    },
    {}
  );

  // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
  return Object.entries(groupedFares).map(([planning, fares]) => ({ name: planning, fares }));
};

export const filterByPlanning =
  (planningToKeep: string) =>
  (faresList: FaresForDatePresentation): FaresForDatePresentation =>
    faresList.filter((fare: FareForDatePresentation): boolean => fare.planning === planningToKeep);

export const toFaresForDatePresentation = (fares: FaresForDate): FaresForDatePresentation =>
  fares.map(toFareForDatePresentation);
export const toFaresForDatePlanningSession = (fares: FaresForDatePresentation): DailyPlanning =>
  fares.map(toFareForDatePlanningSession);
export const toFareForDatePresentation = (fare: FareForDate): FareForDatePresentation => ({
  client: fare.client,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: metersToKilometers(Number(fare.distance)),
  duration: Number(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone.replace(' ', ''),
  planning: fare.planning,
  status: fare.status,
  time: fare.time.substring(1)
});

const metersToKilometers = (meters: number): string => `${(meters / 1000).toFixed(1)} km`;

const isoTimeToMinutes = (timeString: string): number => {
  const parts: string[] | undefined = timeString.split(':');
  const hours: number = parseInt(parts[0] ?? '0', 10);
  // TODO The planning component doesnt handle minutes yet
  //const minutes = parseInt((parts && parts[1]) ?? "0", 10);
  return hours * 60;
};

const fareDurationMinOneHours = (duration: number): number => Math.max(duration, 60);

export const toFareForDatePlanningSession = (fare: FareForDatePresentation): FareForDatePlanningSession => ({
  startTimeInMinutes: isoTimeToMinutes(fare.time),
  client: fare.client,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: fare.distance,
  duration: fareDurationMinOneHours(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone,
  planning: fare.planning,
  status: fare.status,
  time: fare.time
});
